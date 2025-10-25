# 👤 User Profile Page - Design Plan

**Date:** October 22, 2025  
**Design System:** Following Communities Discovery Theme  
**Target:** Rich, User-Friendly Profile with Library (Bibliothèque)

---

## 🎨 Design Inspiration

### Source: Communities Discovery Page
- **Color Scheme:** Gray50 background, White cards, Primary purple (#8e78fb)
- **Typography:** Clean, hierarchical, medium-bold headings
- **Spacing:** Generous padding (16-20px), consistent gaps
- **Components:** Cards with elevation, rounded corners, smooth shadows
- **Icons:** Ionicons for consistent visual language

---

## 📋 Profile Page Structure

### **Layout Hierarchy:**

```
┌────────────────────────────────────┐
│  Profile Header (gradient)         │ ← Hero section
│  Avatar, Name, Bio, Stats          │
├────────────────────────────────────┤
│  Quick Actions (Edit, Settings)    │ ← Action buttons
├────────────────────────────────────┤
│  Tabs Navigation                    │ ← About | Library | Activity
├────────────────────────────────────┤
│  Tab Content                        │
│  ┌──────────────────────────────┐  │
│  │ Library (Bibliothèque)      │  │ ← Main feature
│  │ - Joined Communities        │  │
│  │ - Enrolled Courses          │  │
│  │ - Active Challenges         │  │
│  │ - Booked Sessions           │  │
│  │ - Purchased Products        │  │
│  │ - Events Attending          │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

---

## 🎯 Profile Components

### 1. **Profile Header** (Hero Section)

**Visual:**
- Gradient background (purple to blue)
- Centered avatar (120x120, white border)
- Name (bold, 24px)
- Email/username (gray, 14px)
- Bio (16px, centered)
- Stats row (Joined, Completed, Points)

**Colors:**
```typescript
background: linear-gradient(135deg, #8e78fb 0%, #667eea 100%)
avatar: white border, shadow
text: white
stats: white with opacity
```

**Layout:**
```
┌──────────────────────────────────┐
│                                  │
│          [Avatar 120px]          │
│                                  │
│        Jane Creator              │ ← Name (bold)
│     jane.creator@example.com     │ ← Email
│                                  │
│   Content creator passionate     │ ← Bio
│   about education & tech         │
│                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ 12   │ │  8   │ │ 250  │    │ ← Stats
│  │Joined│ │Done  │ │Points│    │
│  └──────┘ └──────┘ └──────┘    │
└──────────────────────────────────┘
```

---

### 2. **Quick Actions Bar**

**Buttons:**
- Edit Profile (outline)
- Settings (outline)
- Share Profile (outline)

**Style:**
```typescript
Container: flexRow, gap 12px, padding 16px
Buttons: white background, gray border, rounded
Icons: Ionicons (pencil, settings-outline, share-outline)
```

---

### 3. **Tabs Navigation**

**Tabs:**
1. **About** - User info, social links, achievements
2. **Library (Bibliothèque)** - All enrolled/joined content
3. **Activity** - Recent actions, history

**Style:**
```typescript
Container: flexRow, backgroundColor: white
Tab: flex 1, center aligned, padding 16px
Active: borderBottom 3px, color primary
Inactive: color gray500
```

---

### 4. **Library (Bibliothèque) Section** ⭐ Main Feature

#### **Sub-sections:**

##### A. **Joined Communities**
```
Grid/List of community cards
- Community logo
- Name
- Member count
- Last visited
```

##### B. **Enrolled Courses**
```
Course cards with progress
- Course thumbnail
- Title
- Progress bar (%)
- Continue button
```

##### C. **Active Challenges**
```
Challenge cards
- Challenge icon
- Title
- Days remaining
- Progress indicator
- Status badge (Active/Completed)
```

##### D. **Booked 1-on-1 Sessions**
```
Session cards
- Mentor avatar
- Session title
- Date & time
- Status (Upcoming/Past)
```

##### E. **Purchased Products**
```
Product cards
- Product image
- Title
- Purchase date
- Download button
```

##### F. **Events Attending**
```
Event cards
- Event banner
- Title
- Date & location
- Status (Upcoming/Attended)
```

---

## 🎨 Design Tokens Usage

### Colors
```typescript
Background: colors.gray50
Cards: colors.white
Primary: colors.primary (#8e78fb)
Text Primary: colors.gray900
Text Secondary: colors.gray500
Borders: colors.gray200
Success: colors.success
```

### Spacing
```typescript
Container Padding: spacing.xl (20px)
Card Padding: spacing.lg (16px)
Gap Between Cards: spacing.lg (16px)
Section Margin: spacing.xxl (24px)
```

### Typography
```typescript
Hero Name: fontSize.xxl (24px), fontWeight.bold
Section Title: fontSize.lg (18px), fontWeight.semibold
Card Title: fontSize.base (16px), fontWeight.medium
Body Text: fontSize.sm (14px), fontWeight.normal
```

### Border Radius
```typescript
Cards: borderRadius.lg (16px)
Buttons: borderRadius.md (8px)
Avatar: borderRadius.full (999px)
Pills/Tags: borderRadius.xl (20px)
```

---

## 📱 Component Breakdown

### **ProfileCard.tsx** - Reusable card component
```typescript
Props:
  - icon: IconName
  - title: string
  - subtitle: string
  - progress?: number
  - status?: 'active' | 'completed' | 'upcoming'
  - onPress: () => void
```

### **LibrarySection.tsx** - Section wrapper
```typescript
Props:
  - title: string
  - icon: IconName
  - data: Array
  - renderItem: (item) => Component
  - emptyMessage: string
```

### **StatsCard.tsx** - Stat display
```typescript
Props:
  - value: number
  - label: string
  - icon?: IconName
```

### **ProgressBar.tsx** - Visual progress
```typescript
Props:
  - progress: number (0-100)
  - color: string
  - height: number
```

---

## 🎭 Library Card Variations

### **Community Card** (following discovery page style)
```
┌──────────────────────────────────┐
│  [Cover Image 100%x120px]        │
│  ┌────────────────────────────┐  │
│  │ [Logo] Community Name      │  │
│  │ 1,234 members • Technology │  │
│  │ Last visited: 2 days ago   │  │
│  │                            │  │
│  │        [View] [Leave]      │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### **Course Card**
```
┌──────────────────────────────────┐
│  [Thumbnail 100%x120px]          │
│  ┌────────────────────────────┐  │
│  │ Course Title               │  │
│  │ By: Instructor Name        │  │
│  │ ▓▓▓▓▓▓▓░░░ 65%            │  │ ← Progress
│  │ 12 of 18 lessons completed │  │
│  │                            │  │
│  │      [Continue Learning]   │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### **Challenge Card**
```
┌──────────────────────────────────┐
│  [Icon]  Challenge Title         │
│  🎯 Complete 30 JavaScript tasks │
│                                  │
│  Progress: 18/30 ▓▓▓▓▓▓░░░      │
│  ⏱️ 12 days remaining            │
│  🏆 Rank: #5 of 150              │
│                                  │
│  [View Details]                  │
└──────────────────────────────────┘
```

### **Session Card**
```
┌──────────────────────────────────┐
│  [Avatar] 1-on-1 with John Doe   │
│  📅 Oct 25, 2025                 │
│  🕐 10:00 AM - 11:00 AM         │
│  📍 Online (Zoom)                │
│                                  │
│  Status: [Upcoming]              │ ← Badge
│  [Join Meeting] [Reschedule]    │
└──────────────────────────────────┘
```

---

## 🔄 States & Interactions

### **Loading State**
- Skeleton loaders for cards
- Shimmer effect
- Match card dimensions

### **Empty State**
- Illustration/icon
- "No content yet" message
- CTA button (e.g., "Explore Communities")

### **Pull to Refresh**
- Refresh all library data
- Update stats
- Sync with backend

### **Card Interactions**
- Tap: Navigate to detail
- Long press: Quick actions menu
- Swipe: Remove/archive (optional)

---

## 📊 Data Structure

### **UserProfile Interface**
```typescript
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'creator';
  
  stats: {
    communitiesJoined: number;
    coursesCompleted: number;
    challengesWon: number;
    points: number;
  };
  
  library: {
    communities: Community[];
    courses: Course[];
    challenges: Challenge[];
    sessions: Session[];
    products: Product[];
    events: Event[];
  };
  
  createdAt: string;
  updatedAt: string;
}
```

---

## 🚀 Implementation Phases

### **Phase 1: Profile Header** (Day 1)
- Create profile screen layout
- Implement header with gradient
- Add avatar, name, bio
- Add stats cards
- Style according to design tokens

### **Phase 2: Navigation Tabs** (Day 1)
- Implement tab navigation
- Create About, Library, Activity tabs
- Add tab switching logic
- Style active/inactive states

### **Phase 3: Library - Communities** (Day 2)
- Fetch joined communities
- Create community cards
- Implement list/grid view
- Add empty state

### **Phase 4: Library - Courses** (Day 2)
- Fetch enrolled courses
- Create course cards with progress
- Add continue learning button
- Track completion

### **Phase 5: Library - Challenges** (Day 3)
- Fetch active challenges
- Create challenge cards
- Show progress and rank
- Add status badges

### **Phase 6: Library - Sessions, Products, Events** (Day 3)
- Implement remaining sections
- Create respective card components
- Add filtering/sorting
- Polish interactions

### **Phase 7: Polish & Optimization** (Day 4)
- Add animations
- Implement pull-to-refresh
- Add loading skeletons
- Test all interactions
- Responsive design
- Dark mode support (optional)

---

## 🎨 Color Palette for Different Sections

```typescript
Communities: colors.primary (#8e78fb)
Courses: colors.coursesPrimary (#3b82f6)
Challenges: colors.challengesPrimary (#f97316)
Sessions: colors.sessionsPrimary (#F7567C)
Products: colors.productsPrimary (#6366f1)
Events: colors.eventsPrimary (#9333ea)
```

---

## ✅ Success Criteria

- [ ] Follows communities page design language
- [ ] Rich, comprehensive library view
- [ ] Smooth animations and transitions
- [ ] Fast data loading (<2s)
- [ ] Intuitive navigation
- [ ] Empty states for all sections
- [ ] Error handling with retry
- [ ] Pull-to-refresh works
- [ ] Responsive on all screen sizes
- [ ] Accessibility labels present

---

## 🎉 Final Result

A **beautiful, feature-rich user profile** with:
- ✅ Professional hero section
- ✅ Comprehensive library (bibliothèque)
- ✅ All content types in one place
- ✅ Consistent design with discovery page
- ✅ Smooth user experience
- ✅ Rich visual feedback

**Users will love having all their content organized in a beautiful interface!** 🎨✨
