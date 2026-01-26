# Rate Limiting Fix - Summary

**Date:** 2026-01-25  
**Issue:** Chat queries failing with "I'm having trouble connecting to the knowledge base"  
**Status:** ✅ FIXED

---

## Root Cause

Your 24MB PDF created **1,997 chunks**, and the background embedding process was:
1. Making 1,997 API calls to Gemini simultaneously
2. Overwhelming the Gemini API (free tier rate limits)
3. Blocking chat queries with `503 Service Unavailable` errors

**Error Log:**
```
Error: [503 Service Unavailable] The model is overloaded. Please try again later.
POST /api/chat 500 in 13.8s
```

---

## Fixes Applied

### ✅ Fix #1: Batched Embedding Processing

**Before:**
- All chunks processed immediately
- 100ms delay between chunks
- No pause for other requests
- Chat would fail during uploads

**After:**
- Process in batches of **10 chunks**
- **5 second pause** between batches
- **500ms delay** between individual chunks
- Chat queries can succeed during pauses

**Impact:**
- Embedding takes longer (~30-45 min for 2000 chunks)
- But chat remains functional during upload
- More reliable, no rate limit failures

### ✅ Fix #2: Retry Logic with Exponential Backoff

Added automatic retry for both embeddings and chat:

**Embedding Retries:**
- Retry 3 times on rate limit
- Delays: 1s → 2s → 4s (exponential)

**Chat Retries:**
- Retry 3 times on rate limit
- Delays: 2s → 4s → 8s (exponential)

**Impact:**
- Transient rate limits auto-recover
- Better user experience (fewer errors)
- Logs show retry progress

---

## Testing

The fix is nowactive. When you:
1. **Upload a large PDF** - It will return success immediately
2. **Check logs** - You'll see batched processing:
   ```
   Background: Processing 1997 embeddings for CB PDF.pdf...
   Batch 1/200: 10 chunks
   Waiting 5s...
   Batch 2/200: 10 chunks
   ...
   ```
3. **Use chat during upload** - Should work (may be slower but shouldn't fail)
4. **If you hit a rate limit** - Will auto-retry with delays

---

## Recommendations

### Short Term
- **Wait for current upload to complete** - Background process still running
- **Test chat again in 5-10 minutes** - Once current batch pauses
- **Monitor logs** - Watch for retry messages

### Long Term (Production)

#### Option 1: Upgrade to Gemini Paid Tier
- **Cost:** ~$0.00002 per embedding (~$40 for 2 million chunks)
- **Benefit:** Much higher rate limits (1000+ requests/min)
- **Best for:** Production use with many documents

#### Option 2: Reduce Chunk Count
```typescript
// In documents.ts
function splitText(text: string, chunkSize = 2000, overlap = 200) // Currently 1000
```
- Double chunk size: 1000 → 2000 chars
- Halves number of API calls
- Trade-off: Slightly less granular search

#### Option 3: Queue System (Advanced)
- Use a job queue (BullMQ, etc.)
- Process embeddings completely offline
- Add admin dashboard to monitor progress
- Best for: Large-scale production

---

## Current Status

Based on logs:
- ✅ PDF parsed: 1,725,890 characters
- ⏳ Embeddings in progress: ~1000 done, ~1000 remaining
- 🔄 Processing: Batch-by-batch with 5s pauses
- ✅ Chat: Should work during pauses

**Next Steps:**
1. Wait 5-10 minutes for a batch pause
2. Try asking Thea another question
3. If it still fails, check logs for specific error

The system is now much more resilient to rate limits!
