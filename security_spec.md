# ReelForge AI Firestore Security Specification

## 1. Data Invariants
1. **Identity Integrity**: Every document in `/users/{userId}`, `/users/{userId}/private/{docId}`, `/usage/{userId}`, `/projects/{projectId}`, `/projects/{projectId}/scenes/{sceneId}`, `/characters/{characterId}`, `/generationJobs/{jobId}`, and `/exportRecords/{exportId}` belongs strictly to `request.auth.uid` with `request.auth.token.email_verified == true`.
2. **Master Gate Relational Sync**: A scene in `/projects/{projectId}/scenes/{sceneId}` cannot be read, created, updated, or deleted unless its parent `/projects/{projectId}` exists and has `ownerId == request.auth.uid`.
3. **Referential Integrity**: A `generationJobs` or `exportRecords` entry cannot be created unless the referenced `/projects/{projectId}` exists and belongs to `request.auth.uid`.
4. **Immutable Ownership & Timestamps**: `ownerId`, `uid`, `projectId`, `id`, and `createdAt` are immutable after creation; `createdAt` and `updatedAt` must equal `request.time`.
5. **Terminal State Locking**: Once a `generationJobs` or `exportRecords` document reaches `'completed'` or `'failed'`, no subsequent client update is permitted.
6. **PII Isolation**: User email addresses are isolated in `/users/{userId}/private/account` and are never exposed on listable or public documents.

## 2. Adversarial Test Payloads ("Dirty Dozen")
1. **Identity Spoofing on Project Create**: Authenticated user `u1` attempts `create` on `/projects/p1` with `ownerId: "u2"` -> `PERMISSION_DENIED`.
2. **Shadow Field Injection on Project Create**: User `u1` creates `/projects/p1` with extra key `isAdmin: true` -> `PERMISSION_DENIED`.
3. **Unverified Email Write**: User with `email_verified: false` attempts `create` on `/projects/p1` -> `PERMISSION_DENIED`.
4. **Cross-Tenant Project Read**: User `u2` calls `get` on `/projects/p1` owned by `u1` -> `PERMISSION_DENIED`.
5. **Blanket List Scraping**: User `u2` runs `list` on `/projects` without `where('ownerId', '==', 'u2')` -> `PERMISSION_DENIED`.
6. **Orphan Scene Creation**: User `u1` attempts `create` on `/projects/nonexistent/scenes/s1` -> `PERMISSION_DENIED`.
7. **Cross-Owner Scene Injection**: User `u2` attempts `create` on `/projects/p1/scenes/s1` where `p1` is owned by `u1` -> `PERMISSION_DENIED`.
8. **ID Poisoning**: User `u1` attempts `create` on `/projects/` + 200-char ID or invalid characters `../bad` -> `PERMISSION_DENIED`.
9. **Client Timestamp Tampering**: User `u1` attempts `create` on `/projects/p1` with `createdAt` set to past epoch instead of `request.time` -> `PERMISSION_DENIED`.
10. **Immutable Owner Tampering**: User `u1` attempts `update` on `/projects/p1` changing `ownerId` -> `PERMISSION_DENIED`.
11. **Terminal Job Reopen**: User `u1` attempts `update` on `/generationJobs/j1` whose existing `status == 'completed'` -> `PERMISSION_DENIED`.
12. **PII Cross-Read**: User `u2` attempts `get` on `/users/u1/private/account` -> `PERMISSION_DENIED`.
