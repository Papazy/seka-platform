# Linting Todo List

This document lists all the linting errors and warnings that need to be addressed in the project.

## Errors

### `app/(auth)/login/page.tsx`
- **36:19** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/admin/page.tsx`
- **63:32** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **68:32** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/dosen/import/route.ts`
- **41:19** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **53:47** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/mahasiswa/import/route.ts`
- **31:20** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **39:19** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **51:47** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/route.ts`
- **65:24** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **137:21** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **168:49** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **185:32** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **195:15** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **195:25** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **197:19** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **200:19** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **222:36** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **321:55** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **342:49** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/route.ts`
- **58:50** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **71:44** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/mahasiswa/route.ts`
- **87:20** `Error: A 
require() 
style import is forbidden. (@typescript-eslint/no-require-imports)`

### `app/api/praktikum/[id]/participants/import/route.ts`
- **44:23** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **45:19** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **57:47** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/praktikum/[id]/participants/route.ts`
- **191:33** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **192:26** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **203:29** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/praktikum/[id]/tugas/[tugasId]/route.ts`
- **72:57** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/praktikum/[id]/tugas/route.ts`
- **101:54** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **114:48** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/praktikum/import/route.ts`
- **38:19** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **48:47** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/api/soal/[id]/submit/route.ts`
- **122:13** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/laboran/dosen/page.tsx`
- **52:60** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **53:52** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/laboran/mahasiswa/page.tsx`
- **52:60** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **53:52** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/laboran/page.tsx`
- **182:23** `Error: Component definition is missing display name (react/display-name)`
- **193:22** `Error: Component definition is missing display name (react/display-name)`
- **193:54** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **201:18** `Error: Component definition is missing display name (react/display-name)`
- **201:48** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **221:29** `Error: Component definition is missing display name (react/display-name)`
- **221:65** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **237:25** `Error: Component definition is missing display name (react/display-name)`
- **237:59** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **253:27** `Error: Component definition is missing display name (react/display-name)`

### `app/laboran/praktikum/[id]/contoh/page.tsx`
- **131:45** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/laboran/praktikum/create/page.tsx`
- **54:56** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/mahasiswa/praktikum/[id]/(praktikum)/peserta/page.tsx`
- **146:55** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/mahasiswa/praktikum/[id]/(praktikum)/rekap/columns.tsx`
- **54:28** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **56:14** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **107:28** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **109:14** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **112:14** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/mahasiswa/praktikum/[id]/tugas/[tugasId]/edit/page.tsx`
- **27:16** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **175:21** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/page.tsx`
- **208:9** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **253:40** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **381:43** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **472:10** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **497:10** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/mahasiswa/praktikum/[id]/tugas/create/contoh/page.tsx`
- **186:61** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **394:21** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **740:52** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `app/mahasiswa/praktikum/[id]/tugas/create/page.tsx`
- **124:61** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **359:21** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **673:54** `Error: " can be escaped with &quot;, &ldquo;, &#34;, &rdquo;. (react/no-unescaped-entities)`
- **673:42** `Error: " can be escaped with &quot;, &ldquo;, &#34;, &rdquo;. (react/no-unescaped-entities)`
- **738:52** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `components/AsistenSubmission.tsx`
- **103:40** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **157:43** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **256:59** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **280:42** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **281:31** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `components/ProtectedLayout.tsx`
- **49:20** `Error: ' can be escaped with &apos;, &lsquo;, &#39;, &rsquo;. (react/no-unescaped-entities)`

### `components/ProtectedRoutes.tsx`
- **45:20** `Error: ' can be escaped with &apos;, &lsquo;, &#39;, &rsquo;. (react/no-unescaped-entities)`

### `components/TopScoreSidebar.tsx`
- **38:38** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `components/TugasCard.tsx`
- **7:10** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `components/laboran/Sidebar.tsx`
- **166:22** `Error: Component definition is missing display name (react/display-name)`
- **199:23** `Error: Component definition is missing display name (react/display-name)`
- **254:24** `Error: Component definition is missing display name (react/display-name)`
- **313:24** `Error: Component definition is missing display name (react/display-name)`
- **339:24** `Error: Component definition is missing display name (react/display-name)`
- **384:21** `Error: Component definition is missing display name (react/display-name)`

### `components/modals/AddParticipantModal.tsx`
- **30:33** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **68:53** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `components/modals/ImportCSVModal.tsx`
- **29:15** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **45:42** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`
- **76:22** `Error: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)`

### `components/ui/data-table.tsx`
- **150:50** `Error: " can be escaped with &quot;, &ldquo;, &#34;, &rdquo;. (react/no-unescaped-entities)`
- **150:35** `Error: " can be escaped with &quot;, &ldquo;, &#34;, &rdquo;. (react/no-unescaped-entities)`
- **177:47** `Error: " can be escaped with &quot;, &ldquo;, &#34;, &rdquo;. (react/no-unescaped-entities)`
- **177:32** `Error: " can be escaped with &quot;, &ldquo;, &#34;, &rdquo;. (react/no-unescaped-entities)`

## Warnings

### `app/(auth)/login/layout.tsx`
- **1:10** `Warning: 'useRouter' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/(auth)/login/page.tsx`
- **27:6** `Warning: React Hook useEffect has a missing dependency: 'router'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`

### `app/admin/laboran/page.tsx`
- **16:11** `Warning: 'user' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/admin/layout.tsx`
- **2:8** `Warning: 'ProtectedLayout' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/admin/page.tsx`
- **11:3** `Warning: 'ChartBarIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **23:11** `Warning: 'RecentActivity' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/auth/login/route.ts`
- **2:10** `Warning: 'prisma' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/auth/logout/route.ts`
- **3:28** `Warning: 'req' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/fakultas/route.ts`
- **15:11** `Warning: 'payload' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/laboran/route.ts`
- **31:12** `Warning: 'error' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/laboran/stats/route.ts`
- **20:11** `Warning: 'laboranId' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/mahasiswa/import/route.ts`
- **31:11** `Warning: 'records' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/praktikum/[id]/participants/add/route.ts`
- **8:11** `Warning: 'id' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **9:11** `Warning: 'searchParams' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/praktikum/[id]/participants/delete/route.ts`
- **8:11** `Warning: 'id' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/praktikum/[id]/participants/import/route.ts`
- **2:10** `Warning: 'error' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/praktikum/[id]/participants/route.ts`
- **9:13** `Warning: 'id' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/api/program-studi/route.ts`
- **14:11** `Warning: 'payload' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/dosen/[id]/page.tsx`
- **17:3** `Warning: 'ChartBarIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **18:3** `Warning: 'ClockIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **19:3** `Warning: 'CheckCircleIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **20:3** `Warning: 'XCircleIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **21:3** `Warning: 'PhoneIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **22:3** `Warning: 'BuildingOfficeIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **87:6** `Warning: React Hook useEffect has a missing dependency: 'fetchDosen'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`

### `app/laboran/dosen/columns.tsx`
- **10:3** `Warning: 'BookOpenIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **11:3** `Warning: 'UserGroupIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **13:3** `Warning: 'PhoneIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **15:10** `Warning: 'formatDate' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/dosen/create/page.tsx`
- **13:3** `Warning: 'PhoneIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/dosen/edit/[id]/page.tsx`
- **86:6** `Warning: React Hook useEffect has a missing dependency: 'fetchDosen'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`

### `app/laboran/layout.tsx`
- **3:10** `Warning: 'Toaster' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/mahasiswa/[id]/page.tsx`
- **18:3** `Warning: 'ClockIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **19:3** `Warning: 'CheckCircleIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **20:3** `Warning: 'XCircleIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **21:3** `Warning: 'EyeIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **88:6** `Warning: React Hook useEffect has a missing dependency: 'fetchMahasiswa'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`
- **162:9** `Warning: 'allPraktikum' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/mahasiswa/columns.tsx`
- **10:3** `Warning: 'UserGroupIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **11:3** `Warning: 'AcademicCapIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **12:3** `Warning: 'PlusIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **14:10** `Warning: 'formatDate' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **48:3** `Warning: 'onAssignPraktikum' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/mahasiswa/create/page.tsx`
- **9:3** `Warning: 'UserIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **10:3** `Warning: 'AcademicCapIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/mahasiswa/edit/[id]/page.tsx`
- **69:10** `Warning: 'originalNpm' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **70:10** `Warning: 'originalEmail' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **77:6** `Warning: React Hook useEffect has a missing dependency: 'fetchMahasiswa'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`

### `app/laboran/page.tsx`
- **10:3** `Warning: 'UserGroupIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **11:3** `Warning: 'ClipboardDocumentListIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **13:3** `Warning: 'ChartBarIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **14:3** `Warning: 'CalendarIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **15:3** `Warning: 'ClockIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **51:10** `Warning: 'recentPraktikum' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **51:27** `Warning: 'setRecentPraktikum' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **52:10** `Warning: 'recentTugas' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **52:23** `Warning: 'setRecentTugas' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **123:24** `Warning: React Hook useMemo does nothing when called with only one argument. Did you forget to pass an array of dependencies? (react-hooks/exhaustive-deps)`
- **150:9** `Warning: 'formatDeadline' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/praktikum/[id]/columns.tsx`
- **2:10** `Warning: 'EyeIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **46:14** `Warning: 'row' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **93:14** `Warning: 'row' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/praktikum/[id]/contoh/columns.tsx`
- **9:3** `Warning: 'CheckIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **46:9** `Warning: 'handleSelectAll' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **46:28** `Warning: 'checked' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/praktikum/[id]/contoh/page.tsx`
- **17:3** `Warning: 'ArrowPathIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **21:10** `Warning: 'formatDate' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **85:6** `Warning: React Hook useEffect has missing dependencies: 'fetchParticipants' and 'fetchPraktikum'. Either include them or remove the dependency array. (react-hooks/exhaustive-deps)`

### `app/laboran/praktikum/[id]/manage-participants/columns.tsx`
- **3:10** `Warning: 'PencilIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/praktikum/[id]/manage-participants/page.tsx`
- **14:10** `Warning: 'set' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **17:10** `Warning: 'use' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **21:10** `Warning: 'isDeepStrictEqual' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **82:10** `Warning: 'isSelectedAll' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **100:6** `Warning: React Hook useEffect has a missing dependency: 'fetchPraktikum'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`
- **103:6** `Warning: React Hook useEffect has a missing dependency: 'fetchParticipants'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`
- **189:14** `Warning: 'error' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **310:9** `Warning: 'getTabIcon' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/praktikum/[id]/page.tsx`
- **97:6** `Warning: React Hook useEffect has a missing dependency: 'fetchPraktikum'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`
- **150:9** `Warning: 'handleToggleActive' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/praktikum/columns.tsx`
- **10:3** `Warning: 'ClockIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **11:3** `Warning: 'UserGroupIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **12:3** `Warning: 'AcademicCapIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **15:8** `Warning: 'Link' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/praktikum/create/page.tsx`
- **9:3** `Warning: 'CalendarIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **10:3** `Warning: 'ClockIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **11:3** `Warning: 'BookOpenIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **12:3** `Warning: 'BuildingOfficeIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **13:3** `Warning: 'AcademicCapIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/laboran/praktikum/edit/[id]/page.tsx`
- **57:10** `Warning: 'originalKodePraktikum' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **63:6** `Warning: React Hook useEffect has a missing dependency: 'fetchPraktikum'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`

### `app/laboran/praktikum/page.tsx`
- **13:3** `Warning: 'ClockIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **14:3** `Warning: 'BuildingOfficeIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **15:3** `Warning: 'UsersIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **17:3** `Warning: 'FunnelIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **18:3** `Warning: 'DocumentArrowDownIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/page.tsx`
- **3:10** `Warning: 'useEffect' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **7:8** `Warning: 'PraktikumCard' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **28:11** `Warning: 'user' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **54:9** `Warning: 'totalPraktikum' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/(praktikum)/page.tsx`
- **5:8** `Warning: 'LeftSidebar' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **9:8** `Warning: 'ReactMarkdown' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **13:11** `Warning: 'PraktikumDetail' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **77:12** `Warning: 'praktikumError' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **78:14** `Warning: 'refetchPraktikum' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/(praktikum)/peserta/columns.tsx`
- **4:10** `Warning: 'formatDate' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/(praktikum)/peserta/page.tsx`
- **3:10** `Warning: 'useEffect' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **6:8** `Warning: 'LeftSidebar' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **12:11** `Warning: 'PesertaData' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **58:5** `Warning: 'isError' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **59:5** `Warning: 'refetch' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/(praktikum)/rekap/page.tsx`
- **3:10** `Warning: 'useEffect' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **6:8** `Warning: 'LeftSidebar' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **12:11** `Warning: 'RekapNilai' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **66:12** `Warning: 'rekapError' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **67:14** `Warning: 'refetchRekap' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/tugas/[tugasId]/edit/page.tsx`
- **47:16** `Warning: 'TugasLoading' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **48:12** `Warning: 'TugasError' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **81:6** `Warning: React Hook useEffect has a missing dependency: 'selectedBahasa.length'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`

### `app/mahasiswa/praktikum/[id]/tugas/[tugasId]/page.tsx`
- **3:10** `Warning: 'useEffect' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/edit/page.tsx`
- **42:11** `Warning: 'user' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/[soalId]/page.tsx`
- **7:18** `Warning: 'useBahasa' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **35:11** `Warning: 'TopScore' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **519:6** `Warning: React Hook useEffect has a missing dependency: 'selectedLanguage'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`
- **536:16** `Warning: 'err' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/tugas/[tugasId]/soal/create/page.tsx`
- **147:13** `Warning: 'result' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/tugas/create/contoh/page.tsx`
- **50:11** `Warning: 'BahasaPemrograman' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **61:11** `Warning: 'user' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **69:16** `Warning: 'bahasaLoading' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **70:12** `Warning: 'bahasaError' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **195:9** `Warning: 'handleBahasaToggle' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **215:9** `Warning: 'handleSelectAllBahasa' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **221:9** `Warning: 'handleDeselectAllBahasa' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **373:31** `Warning: 'id' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **1175:20** `Warning: 'node' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/[id]/tugas/create/page.tsx`
- **8:8** `Warning: 'remarkGfm' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **9:8** `Warning: 'ReactMarkdown' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **11:3** `Warning: 'Check' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **49:11** `Warning: 'user' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **330:38** `Warning: 'id' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `app/mahasiswa/praktikum/page.tsx`
- **4:10** `Warning: 'Router' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **5:10** `Warning: 'useEffect' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **6:8** `Warning: 'toast' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **13:6** `Warning: 'ViewMode' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **25:12** `Warning: 'praktikumError' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **26:14** `Warning: 'refetchPraktikum' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **58:6** `Warning: React Hook useMemo has missing dependencies: 'filterByActive' and 'filterBySearch'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`
- **62:6** `Warning: React Hook useMemo has missing dependencies: 'filterByActive' and 'filterBySearch'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`

### `app/mahasiswa/tugas/page.tsx`
- **4:8** `Warning: 'ToggleViewMode' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **28:10** `Warning: 'searchQuery' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **28:23** `Warning: 'setSearchQuery' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **29:11** `Warning: 'viewMode' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **29:21** `Warning: 'setViewMode' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **35:14** `Warning: 'refetchTugas' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/profile/page.tsx`
- **6:8** `Warning: 'ProtectedLayout' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **10:3** `Warning: 'EnvelopeIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **11:3** `Warning: 'CalendarIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **45:11** `Warning: 'user' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **55:10** `Warning: 'isProfileUpdating' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `app/providers.tsx`
- **5:17** `Warning: 'useState' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `components/AssistantPanel.tsx`
- **8:32** `Warning: 'assignmentId' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **12:34** `Warning: 'assignmentId' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `components/ConfirmDeleteModal.tsx`
- **23:3** `Warning: 'isLoading' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `components/LeftSidebar.tsx`
- **3:17** `Warning: 'useState' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `components/MarkdownRenderer.tsx`
- **21:20** `Warning: 'node' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `components/ProtectedRoutes.tsx`
- **23:6** `Warning: React Hook useEffect has a missing dependency: 'user'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)`

### `components/SoalContent.tsx`
- **19:9** `Warning: 'handleSoalClick' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `components/StudentView.tsx`
- **11:11** `Warning: 'id' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `components/SubmissionsList.tsx`
- **29:3** `Warning: 'getStatusColor' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `components/TopScoreSidebar.tsx`
- **5:9** `Warning: 'params' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`
- **7:39** `Warning: 'error' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `components/admin/Sidebar.tsx`
- **18:10** `Warning: 'Button' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `components/laboran/Sidebar.tsx`
- **12:3** `Warning: 'UserGroupIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **14:3** `Warning: 'ClipboardDocumentListIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `components/modals/AddParticipantModal.tsx`
- **54:6** `Warning: React Hook useEffect has missing dependencies: 'searchResults.length' and 'searchUsers'. Either include them or remove the dependency array. (react-hooks/exhaustive-deps)`

### `components/modals/ConfirmDeleteModal.tsx`
- **23:3** `Warning: 'isLoading' is assigned a value but never used. (@typescript-eslint/no-unused-vars)`

### `components/modals/ImportCSVModal.tsx`
- **15:3** `Warning: 'XMarkIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **17:3** `Warning: 'ExclamationTriangleIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **18:3** `Warning: 'EyeIcon' is defined but never used. (@typescript-eslint/no-unused-vars)`
- **40:3** `Warning: 'sampleData' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `lib/auth.ts`
- **31:12** `Warning: 'error' is defined but never used. (@typescript-eslint/no-unused-vars)`

### `lib/validations/praktikum.ts`
- **1:10** `Warning: 'error' is defined but never used. (@typescript-eslint/no-unused-vars)`
