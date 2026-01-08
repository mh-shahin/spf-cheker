import { NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);

export async function POST(request) {
  try {
    const { domain } = await request.json();

    // Validate domain
    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: 'Invalid domain provided' },
        { status: 400 }
      );
    }

    // Clean the domain (remove http://, https://, www., trailing slashes, etc.)
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .trim();

    // Basic domain validation regex
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\.[a-zA-Z]{2,}$/;
    
    if (!domainRegex.test(cleanDomain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      );
    }

    // Perform DNS TXT lookup
    const records = await resolveTxt(cleanDomain);

    // Filter SPF records (records that start with v=spf1)
    const spfRecords = records
      .map(record => record.join('')) // TXT records can be arrays of strings
      .filter(record => record.toLowerCase().startsWith('v=spf1'));

    if (spfRecords.length === 0) {
      return NextResponse.json({
        domain: cleanDomain,
        spfRecords: [],
        message: 'No SPF record found for this domain'
      });
    }

    // Parse SPF records to identify mechanisms
    const parsedRecords = spfRecords.map(record => {
      const mechanisms = [];
      const parts = record.split(/\s+/);

      parts.forEach(part => {
        if (part.startsWith('include:')) {
          mechanisms.push({
            type: 'include',
            value: part.substring(8),
            full: part
          });
        } else if (part.startsWith('redirect=')) {
          mechanisms.push({
            type: 'redirect',
            value: part.substring(9),
            full: part
          });
        } else if (part.startsWith('a:') || part.startsWith('mx:') || 
                   part.startsWith('ip4:') || part.startsWith('ip6:') ||
                   part === 'a' || part === 'mx' || part === 'all' ||
                   part.startsWith('+') || part.startsWith('-') || 
                   part.startsWith('~') || part.startsWith('?')) {
          mechanisms.push({
            type: 'mechanism',
            value: part,
            full: part
          });
        }
      });

      return {
        raw: record,
        mechanisms
      };
    });

    return NextResponse.json({
      domain: cleanDomain,
      spfRecords: parsedRecords,
      message: `Found ${spfRecords.length} SPF record(s)`
    });

  } catch (error) {
    // Handle specific DNS errors
    if (error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Domain not found' },
        { status: 404 }
      );
    } else if (error.code === 'ENODATA') {
      return NextResponse.json({
        domain: request.domain,
        spfRecords: [],
        message: 'No TXT records found for this domain'
      });
    }

    console.error('DNS lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to perform DNS lookup' },
      { status: 500 }
    );
  }
}