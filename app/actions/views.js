'use server';

import { headers } from 'next/headers';
import prisma from '@/prisma/db';
import crypto from 'crypto';

// Bot detection patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /slurp/i,
  /spider/i,
  /whatsapp/i,
  /telegram/i,
  /slack/i,
  /viber/i,
  /discord/i,
  /skype/i,
  /facebook/i,
  /twitter/i,
  /linkedin/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /baidu/i,
  /duckduckgo/i,
  /curl/i,
  /wget/i,
  /python/i,
  /node/i,
  /axios/i,
  /postman/i,
];

function isBot(userAgent) {
  if (!userAgent) return true;
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

function getClientIP(headersList) {
  // Try various headers that might contain the real IP
  const possibleHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'true-client-ip',   // Cloudflare Enterprise
    'x-cluster-client-ip',
  ];

  for (const header of possibleHeaders) {
    const value = headersList.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim();
      if (ip && ip !== 'unknown') {
        return ip;
      }
    }
  }

  return 'unknown';
}

function createViewerHash(ip, userAgent) {
  // Create a hash of IP + User Agent for duplicate detection
  // This preserves privacy while allowing duplicate detection
  const identifier = `${ip}-${userAgent}`;
  return crypto.createHash('sha256').update(identifier).digest('hex');
}

async function canTrackView(postId, viewerHash) {
  // Check if this viewer has already viewed this post in the last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const existingView = await prisma.postView.findFirst({
    where: {
      postId,
      viewerHash,
      timestamp: {
        gte: oneDayAgo
      }
    }
  });

  return !existingView;
}

export async function trackPostView(postSlug) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const ip = getClientIP(headersList);
    const referrer = headersList.get('referer') || '';

    // Skip bot traffic
    if (isBot(userAgent)) {
      console.log('Bot detected, skipping view tracking:', userAgent);
      return { success: false, reason: 'bot_detected' };
    }

    // Skip if no valid IP
    if (ip === 'unknown') {
      console.log('Unknown IP, skipping view tracking');
      return { success: false, reason: 'unknown_ip' };
    }

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { id: true, views: true }
    });

    if (!post) {
      return { success: false, reason: 'post_not_found' };
    }

    // Create viewer fingerprint
    const viewerHash = createViewerHash(ip, userAgent);

    // Check if we can track this view (not a duplicate within 24h)
    if (!(await canTrackView(post.id, viewerHash))) {
      return { success: false, reason: 'duplicate_view' };
    }

    // Use a transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // Create the view record
      await tx.postView.create({
        data: {
          postId: post.id,
          viewerHash,
          ipAddress: ip,
          userAgent,
          referrer
        }
      });

      // Increment the view counter on the post
      await tx.post.update({
        where: { id: post.id },
        data: {
          views: {
            increment: 1
          }
        }
      });
    });

    return { 
      success: true, 
      views: post.views + 1 // Return the new view count
    };

  } catch (error) {
    console.error('Error tracking post view:', error);
    return { success: false, reason: 'server_error' };
  }
} 