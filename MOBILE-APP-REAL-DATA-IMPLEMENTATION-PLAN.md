# 📱 Mobile App Real Data Implementation Plan

## 🎯 Executive Summary

This document provides a comprehensive analysis of the mobile app's current state, backend capabilities, and a detailed roadmap for implementing real API data integration to deliver the best user experience.

---

## 📊 Current Status Analysis

### ✅ **FULLY IMPLEMENTED (Real API Data)**

#### 1. **Authentication & User Management** ✅
- **Files**: `lib/auth.ts`, `lib/auth-api.ts`, `hooks/use-auth.ts`
- **Backend**: `/api/auth/*` endpoints
- **Features**:
  - ✅ Login with 2FA
  - ✅ Signup/Registration
  - ✅ Logout with token revocation
  - ✅ Forgot/Reset Password
  - ✅ JWT token refresh
  - ✅ User profile (`/api/auth/me`)
  - ✅ Session management
  - ✅ Secure token storage (SecureStore)

#### 2. **User Profile** ✅
- **Files**: `app/(profile)/index.tsx`, `lib/profile-api.ts`
- **Backend**: `/api/auth/me`, `/api/user/*`
- **Features**:
  - ✅ View profile with real data
  - ✅ Edit profile (avatar, bio, contact, location)
  - ✅ User statistics (communities, courses, challenges)
  - ✅ Activity feed
  - ✅ Beautiful glass-morphism UI
  - ✅ Image upload for avatar

#### 3. **Communities Discovery** ✅
- **Files**: `app/(communities)/index.tsx`, `lib/communities-api.ts`
- **Backend**: `/api/communities/*`
- **Features**:
  - ✅ Browse communities with pagination
  - ✅ Search communities
  - ✅ Filter by category
  - ✅ Community details
  - ✅ Join/Leave communities
  - ✅ Membership status tracking
  - ✅ Real-time member counts

---

### 🚧 **PARTIALLY IMPLEMENTED (Mixed Mock/Real Data)**

#### 1. **Community Detail Page** 🚧
- **File**: `app/(community)/[slug]/index.tsx`
- **Current**: Uses `getCommunityBySlug()` from mock-data
- **Backend Available**: `/api/community-aff-crea-join/:id`
- **Status**: Join/Leave integrated, but detail view uses mock data
- **Action Required**: Replace mock data fetch with real API call

#### 2. **Community Creation** 🚧
- **File**: `app/(build_community)/index.tsx`
- **Current**: Beautiful wizard UI exists but not connected
- **Backend Available**: `POST /api/community-aff-crea-join/create`
- **Status**: Frontend complete, needs API integration
- **Action Required**: Connect wizard to create endpoint

---

### ❌ **NOT IMPLEMENTED (100% Mock Data)**

#### 1. **Courses Module** ❌
- **File**: `app/(community)/[slug]/courses/index.tsx`
- **Current**: Uses `course-utils.ts` with mock data
- **Backend Available**:
  - `GET /api/cours` - List courses
  - `GET /api/cours/:id` - Course details
  - `POST /api/course-enrollment/:courseId/sections/:sectionId/chapters/:chapterId/start`
  - `PUT /api/course-enrollment/:courseId/chapters/:chapterId/complete`
  - `GET /api/course-enrollment/:courseId/progress`
- **API Files Needed**: Create `course-api.ts`

#### 2. **Challenges Module** ❌
- **File**: `app/(community)/[slug]/challenges/index.tsx`
- **Current**: Uses `challenge-utils.ts` with mock data
- **Backend Available**:
  - `GET /api/challenges` - List challenges
  - `GET /api/challenges/:id` - Challenge details
  - `POST /api/challenges/:id/join` - Join challenge
  - `POST /api/challenges/:id/leave` - Leave challenge
  - `PUT /api/challenges/:id/progress` - Update progress
  - `GET /api/challenges/community/:communitySlug` - Community challenges
- **API Files Needed**: Create `challenge-api.ts`

#### 3. **Events Module** ❌
- **File**: `app/(community)/[slug]/events/index.tsx`
- **Current**: Uses `mock-data.ts` for events
- **Backend Available**:
  - `GET /api/events` - List events
  - `GET /api/events/:id` - Event details
  - `POST /api/events/:id/register` - Register for event
  - `POST /api/events/:id/tickets/purchase` - Purchase ticket
  - `GET /api/events/community/:communityId` - Community events
- **API Files Needed**: Create `event-api.ts`

#### 4. **Products Module** ❌
- **File**: `app/(community)/[slug]/products/index.tsx`
- **Current**: Uses `mock-data.ts` for products
- **Backend Available**:
  - `GET /api/products` - List products
  - `GET /api/products/:id` - Product details
  - `POST /api/products/:id/purchase` - Purchase product
  - `GET /api/products/community/:communityId` - Community products
- **API Files Needed**: Create `product-api.ts`

#### 5. **Sessions (1-on-1)** ❌
- **File**: `app/(community)/[slug]/sessions/index.tsx`
- **Current**: Uses `session-utils.ts` with mock data
- **Backend Available**:
  - `GET /api/sessions` - List sessions
  - `POST /api/sessions/book` - Book session
  - `GET /api/sessions/my-bookings` - User's bookings
- **API Files Needed**: Create `session-api.ts`

#### 6. **Posts & Feed** ❌
- **Current**: No dedicated posts screen yet
- **Backend Available**:
  - `GET /api/posts` - List posts
  - `POST /api/posts` - Create post
  - `POST /api/posts/:id/like` - Like post
  - `POST /api/posts/:id/comment` - Comment on post
  - `DELETE /api/posts/:id` - Delete post
- **Files Needed**: Create posts screen & `post-api.ts`

#### 7. **Direct Messages** ❌
- **Current**: Not implemented
- **Backend Available**:
  - `GET /api/dm/conversations` - List conversations
  - `GET /api/dm/:conversationId` - Conversation messages
  - `POST /api/dm/send` - Send message
  - `PUT /api/dm/:messageId/read` - Mark as read
- **Files Needed**: Create DM screen & `dm-api.ts`

#### 8. **Notifications** ❌
- **Current**: Not implemented
- **Backend Available**:
  - `GET /api/notifications` - List notifications
  - `PUT /api/notifications/:id/read` - Mark as read
  - `PUT /api/notifications/read-all` - Mark all as read
- **Files Needed**: Create notifications screen & `notification-api.ts`

---

## 🏗️ Backend Capabilities Overview

### **User Role: `'user'`** (Regular Member)

The backend is feature-complete with the following capabilities:

#### **Core Features**
1. ✅ Authentication & profile management
2. ✅ Browse & join communities
3. ✅ Enroll in courses & track progress
4. ✅ Join challenges & submit progress
5. ✅ Register for events & purchase tickets
6. ✅ Purchase digital products
7. ✅ Book 1-on-1 sessions
8. ✅ Create & interact with posts
9. ✅ Send/receive direct messages
10. ✅ Receive notifications
11. ✅ View analytics & statistics
12. ✅ Provide feedback

#### **Advanced Features**
1. ✅ Sequential course progression
2. ✅ Challenge leaderboards
3. ✅ Event ticketing with QR codes
4. ✅ Product downloads & access
5. ✅ Session booking with calendar integration
6. ✅ Payment processing (Flouci, Stripe)
7. ✅ File uploads (images, videos, documents)
8. ✅ Google Calendar integration

---

## 📋 Implementation Roadmap

### **PHASE 1: Core Content Modules** (Week 1-2)
**Goal**: Enable users to access community content

#### **Priority 1A: Courses Module** 🎯
**Estimated Time**: 3-4 days

**Tasks**:
1. Create `lib/course-api.ts` with functions:
   ```typescript
   - getCourses(communityId, filters)
   - getCourseById(courseId)
   - enrollInCourse(courseId)
   - startChapter(courseId, sectionId, chapterId)
   - completeChapter(courseId, chapterId)
   - getCourseProgress(courseId)
   - updateWatchTime(courseId, chapterId, watchTime)
   ```

2. Update `app/(community)/[slug]/courses/index.tsx`:
   - Replace mock data with API calls
   - Add loading states
   - Implement error handling
   - Add pull-to-refresh

3. Create course detail screen:
   - Course overview with sections
   - Enrollment button
   - Progress tracking
   - Chapter navigation

4. Create chapter viewer:
   - Video player
   - Progress tracking
   - Mark as complete
   - Sequential unlocking

**Backend Endpoints**:
- `GET /api/cours?communityId=xxx`
- `GET /api/cours/:id`
- `POST /api/course-enrollment/:courseId/sections/:sectionId/chapters/:chapterId/start`
- `PUT /api/course-enrollment/:courseId/chapters/:chapterId/complete`
- `GET /api/course-enrollment/:courseId/progress`

#### **Priority 1B: Challenges Module** 🎯
**Estimated Time**: 2-3 days

**Tasks**:
1. Create `lib/challenge-api.ts` with functions:
   ```typescript
   - getChallenges(communityId, filters)
   - getChallengeById(id)
   - joinChallenge(id)
   - leaveChallenge(id)
   - updateProgress(id, progressData)
   - getMyParticipation(id)
   - getLeaderboard(id)
   ```

2. Update `app/(community)/[slug]/challenges/index.tsx`:
   - Replace mock data with API calls
   - Add loading & error states
   - Real-time participation tracking

3. Create challenge detail screen:
   - Challenge info & tasks
   - Join/Leave functionality
   - Progress submission
   - Leaderboard view

**Backend Endpoints**:
- `GET /api/challenges?communitySlug=xxx`
- `GET /api/challenges/:id`
- `POST /api/challenges/:id/join`
- `POST /api/challenges/:id/leave`
- `PUT /api/challenges/:id/progress`

#### **Priority 1C: Events Module** 🎯
**Estimated Time**: 2-3 days

**Tasks**:
1. Create `lib/event-api.ts`:
   ```typescript
   - getEvents(communityId, filters)
   - getEventById(id)
   - registerForEvent(id)
   - purchaseTicket(eventId, ticketTypeId)
   - getMyTickets()
   ```

2. Update `app/(community)/[slug]/events/index.tsx`:
   - Real event data
   - Registration flow
   - Ticket purchasing

3. Create event detail screen:
   - Event information
   - Speakers & sessions
   - Ticket selection
   - QR code for tickets

**Backend Endpoints**:
- `GET /api/events?communityId=xxx`
- `GET /api/events/:id`
- `POST /api/events/:id/register`
- `POST /api/events/:id/tickets/purchase`

#### **Priority 1D: Products Module** 🎯
**Estimated Time**: 2-3 days

**Tasks**:
1. Create `lib/product-api.ts`:
   ```typescript
   - getProducts(communityId, filters)
   - getProductById(id)
   - purchaseProduct(id, variantId?)
   - getMyPurchases()
   - downloadProduct(productId, fileId)
   ```

2. Update `app/(community)/[slug]/products/index.tsx`:
   - Real product data
   - Purchase flow
   - Download management

3. Create product detail screen:
   - Product info & variants
   - Purchase button
   - Download links
   - Reviews/ratings

**Backend Endpoints**:
- `GET /api/products?communityId=xxx`
- `GET /api/products/:id`
- `POST /api/products/:id/purchase`

### **PHASE 2: Community Engagement** (Week 3)
**Goal**: Enable social interactions

#### **Priority 2A: Posts & Feed** 🎯
**Estimated Time**: 3-4 days

**Tasks**:
1. Create `lib/post-api.ts`:
   ```typescript
   - getPosts(communityId, filters)
   - createPost(data)
   - likePost(postId)
   - commentOnPost(postId, comment)
   - deletePost(postId)
   ```

2. Create community feed screen:
   - Post creation form
   - Feed with posts
   - Like/Comment interactions
   - Image/video support

3. Integrate into community home:
   - Activity feed
   - Recent posts
   - Trending content

**Backend Endpoints**:
- `GET /api/posts?communityId=xxx`
- `POST /api/posts`
- `POST /api/posts/:id/like`
- `POST /api/posts/:id/comment`

#### **Priority 2B: Sessions (1-on-1)** 🎯
**Estimated Time**: 2-3 days

**Tasks**:
1. Create `lib/session-api.ts`:
   ```typescript
   - getSessions(filters)
   - getSessionById(id)
   - bookSession(sessionTypeId, date, time)
   - getMyBookings()
   - cancelBooking(bookingId)
   ```

2. Update sessions screen:
   - Real session data
   - Booking calendar
   - Payment integration

**Backend Endpoints**:
- `GET /api/sessions`
- `POST /api/sessions/book`
- `GET /api/sessions/my-bookings`

### **PHASE 3: Communication & Notifications** (Week 4)
**Goal**: Real-time communication

#### **Priority 3A: Direct Messages** 🎯
**Estimated Time**: 3-4 days

**Tasks**:
1. Create `lib/dm-api.ts`:
   ```typescript
   - getConversations()
   - getMessages(conversationId)
   - sendMessage(recipientId, content)
   - markAsRead(messageId)
   ```

2. Create DM screens:
   - Conversations list
   - Chat interface
   - Real-time messaging
   - Media sharing

**Backend Endpoints**:
- `GET /api/dm/conversations`
- `GET /api/dm/:conversationId`
- `POST /api/dm/send`

#### **Priority 3B: Notifications** 🎯
**Estimated Time**: 2 days

**Tasks**:
1. Create `lib/notification-api.ts`:
   ```typescript
   - getNotifications()
   - markAsRead(notificationId)
   - markAllAsRead()
   ```

2. Create notifications screen:
   - Notification list
   - Badge counts
   - Action handlers

**Backend Endpoints**:
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`

### **PHASE 4: Community Management** (Week 5)
**Goal**: Enable users to create communities

#### **Priority 4A: Community Creation** 🎯
**Estimated Time**: 2-3 days

**Tasks**:
1. Update `lib/build-community-api.ts`:
   - Connect wizard to create endpoint
   - Handle logo upload
   - Payment integration for creators

2. Connect existing wizard UI:
   - Step 1-6 data collection
   - Submit to API
   - Success navigation

**Backend Endpoints**:
- `POST /api/community-aff-crea-join/create`

#### **Priority 4B: My Communities** 🎯
**Estimated Time**: 1-2 days

**Tasks**:
1. Update `lib/communities-api.ts`:
   - Add `getMyCreatedCommunities()`
   - Add `getMyJoinedCommunities()` (already exists)

2. Create "My Communities" screen:
   - Created communities tab
   - Joined communities tab
   - Quick access

**Backend Endpoints**:
- `GET /api/community-aff-crea-join/my-created`
- `GET /api/community-aff-crea-join/my-joined` (already integrated)

### **PHASE 5: Polish & Optimization** (Week 6)
**Goal**: Perfect user experience

#### **Tasks**:
1. **Performance Optimization**
   - Implement caching strategies
   - Image lazy loading
   - Pagination optimization
   - Reduce API calls

2. **Offline Support**
   - Cache critical data
   - Queue actions when offline
   - Sync when back online

3. **Error Handling**
   - Consistent error messages
   - Retry mechanisms
   - Network error handling

4. **Loading States**
   - Skeleton screens
   - Progress indicators
   - Optimistic updates

5. **User Feedback**
   - Success toasts
   - Error alerts
   - Confirmation dialogs

---

## 📐 Implementation Guidelines

### **API Integration Pattern**

For each module, follow this pattern:

```typescript
// 1. Create API file: lib/[module]-api.ts
import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

export async function getData(params) {
  const token = await getAccessToken();
  const resp = await tryEndpoints('/api/endpoint', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  
  if (resp.status >= 200 && resp.status < 300) {
    return resp.data;
  }
  
  throw new Error(resp.data.message || 'Failed to fetch');
}

// 2. Update component
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError('');
    const result = await getData(params);
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// 3. Render with states
if (loading) return <LoadingIndicator />;
if (error) return <ErrorMessage error={error} onRetry={loadData} />;
return <DataView data={data} />;
```

---

## 🎨 UX Enhancements

### **Consistent Patterns**

1. **Loading States**
   - Use skeleton screens for lists
   - Shimmer effects for cards
   - Spinner for simple loads

2. **Error Handling**
   - User-friendly messages
   - Retry buttons
   - Fallback UI

3. **Empty States**
   - Helpful illustrations
   - Clear call-to-action
   - Suggestions

4. **Optimistic Updates**
   - Instant UI feedback
   - Revert on failure
   - Background sync

5. **Pull-to-Refresh**
   - Standard on all lists
   - Clear feedback
   - Fresh data on pull

---

## 📊 Success Metrics

### **Implementation Progress**

Track completion using this checklist:

- [ ] **Phase 1: Core Content** (40% of total)
  - [ ] Courses Module (10%)
  - [ ] Challenges Module (10%)
  - [ ] Events Module (10%)
  - [ ] Products Module (10%)

- [ ] **Phase 2: Engagement** (25% of total)
  - [ ] Posts & Feed (15%)
  - [ ] Sessions (10%)

- [ ] **Phase 3: Communication** (20% of total)
  - [ ] Direct Messages (12%)
  - [ ] Notifications (8%)

- [ ] **Phase 4: Management** (10% of total)
  - [ ] Community Creation (5%)
  - [ ] My Communities (5%)

- [ ] **Phase 5: Polish** (5% of total)
  - [ ] Performance (2%)
  - [ ] Offline Support (1%)
  - [ ] Error Handling (1%)
  - [ ] Loading States (1%)

### **Current Progress: 20%**
- ✅ Auth & Profile (10%)
- ✅ Communities Discovery (10%)

### **Target: 100% in 6 weeks**

---

## 🚀 Getting Started

### **Week 1 Focus: Courses**

1. Create `mobile/lib/course-api.ts`
2. Update courses screen
3. Test enrollment flow
4. Add progress tracking

**Success Criteria**:
- Users can browse courses
- Users can enroll in courses
- Users can watch videos
- Progress is tracked accurately

---

## 📝 Notes

### **Key Principles**

1. **User-First**: Every feature serves user needs
2. **Real Data**: No mock data in production paths
3. **Error Resilient**: Graceful failures everywhere
4. **Performance**: Fast, smooth, responsive
5. **Consistency**: Same patterns across modules

### **Tech Stack Alignment**

- **Mobile**: React Native + Expo
- **State**: React hooks + Context
- **Storage**: Expo SecureStore
- **HTTP**: Custom retry logic with fallback
- **Backend**: NestJS REST APIs
- **Auth**: JWT with refresh tokens

---

## 🎯 Conclusion

This plan transforms the mobile app from **20% real data to 100% real data** in 6 weeks, delivering a premium user experience with:

- ✅ Full backend integration
- ✅ Offline support
- ✅ Real-time updates
- ✅ Consistent UX patterns
- ✅ Production-ready quality

**Next Step**: Begin Phase 1A (Courses Module) immediately.

---

*Last Updated: October 23, 2025*
*Document Owner: Development Team*
*Status: ACTIVE ROADMAP*
