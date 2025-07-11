<<<<<<< HEAD
# Teamz
=======
# Teamz IT Management System

A comprehensive IT management platform built with Next.js, React, and TypeScript. This system provides enterprise-grade features for managing users, devices, incidents, projects, and more with advanced bulk operations and audit logging.

## 🚀 Features

### Core Management
- **User Management**: Complete user lifecycle management with roles and permissions
- **Device Management**: Track and manage IT equipment and devices
- **Incident Management**: Handle IT incidents and support requests
- **Project Management**: Manage IT projects and track progress
- **Department Management**: Organize users by departments
- **Inventory Management**: Track IT assets and inventory

### Advanced Features
- **Bulk Operations**: Select multiple items and perform bulk actions
  - Bulk delete, export, status updates
  - Bulk email notifications
  - Select all/none functionality
- **Audit Logging**: Comprehensive audit trail for compliance
  - Track all user actions and system events
  - Filter by category, severity, date range
  - Export logs in JSON/CSV format
- **Real-time Notifications**: Live notification system
  - Notification bell with unread count
  - Real-time updates every 30 seconds
  - User-specific notifications
- **Authentication & Authorization**: Role-based access control
  - Login/logout functionality
  - Permission-based access
  - Session management
- **Responsive Design**: Mobile-first approach
  - Responsive tables with mobile cards
  - Touch-friendly interfaces
  - Adaptive layouts

### User Experience
- **Search & Filter**: Advanced search and filtering capabilities
  - Multi-field search
  - Sortable columns
  - Filter by status, category, etc.
- **Loading States**: Skeleton loading components
  - Table skeletons
  - Card skeletons
  - Chart placeholders
- **Error Handling**: Comprehensive error boundaries
  - Graceful error recovery
  - User-friendly error messages
  - Retry mechanisms

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications
- **Charts**: Recharts for data visualization
- **Testing**: Jest, React Testing Library
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd teamz-it-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
teamz-it-management/
├── app/                    # Next.js app router pages
│   ├── users/             # User management
│   ├── devices/           # Device management
│   ├── incidents/         # Incident management
│   ├── projects/          # Project management
│   ├── audit-logs/        # Audit logs viewer
│   └── ...
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── modals/           # Modal components
│   ├── bulk-actions.tsx  # Bulk operations
│   ├── audit-log-viewer.tsx
│   └── ...
├── lib/                  # Utility functions and types
│   ├── api.ts           # API client
│   ├── auth.ts          # Authentication
│   ├── audit-log.ts     # Audit logging
│   └── ...
├── __tests__/           # Test files
└── public/              # Static assets
```

## 🔧 Key Components

### Bulk Actions Component
```tsx
import { BulkActions } from '@/components/bulk-actions'

<BulkActions
  selectedItems={selectedUsers}
  totalItems={users.length}
  onSelectAll={handleSelectAll}
  onBulkDelete={handleBulkDelete}
  onBulkExport={handleBulkExport}
  onBulkStatusUpdate={handleBulkStatusUpdate}
  onBulkEmail={handleBulkEmail}
  entityType="users"
/>
```

### Audit Logging
```tsx
import { auditLogger } from '@/lib/audit-log'

// Log user actions
auditLogger.logUserAction(
  userId,
  userName,
  action,
  entityType,
  entityId,
  details
)

// Log bulk operations
auditLogger.logBulkOperation(
  userId,
  userName,
  action,
  entityType,
  itemCount,
  details
)
```

### Responsive Table
```tsx
import { ResponsiveTable } from '@/components/responsive-table'

<ResponsiveTable
  data={users}
  columns={columns}
  onRowClick={handleRowClick}
  actions={[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete }
  ]}
/>
```

## 🔐 Authentication

The system includes a mock authentication system with predefined users:

- **Admin User**: `admin@company.com` / `admin123`
- **Supervisor**: `laurian.lawrence@company.com` / `supervisor123`

## 📊 Audit Logging

The audit system tracks:
- User actions (login, logout, CRUD operations)
- Bulk operations (delete, export, status updates)
- Security events (failed logins, permission violations)
- System events (backups, maintenance)

### Audit Log Categories
- `user`: Individual user actions
- `system`: System-level events
- `security`: Security-related events
- `bulk_operation`: Bulk operations
- `data_access`: Data access events

### Severity Levels
- `info`: Normal operations
- `warning`: Potential issues
- `error`: Errors that need attention
- `critical`: Critical security or system issues

## 🎨 UI Components

### Loading Skeletons
```tsx
import { TableSkeleton, CardsSkeleton, ChartSkeleton } from '@/components/loading-skeleton'

// Table loading state
<TableSkeleton rows={5} columns={4} />

// Cards loading state
<CardsSkeleton count={4} />

// Chart loading state
<ChartSkeleton />
```

### Error Boundaries
```tsx
import { ErrorBoundary } from '@/components/error-boundary'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Adaptive tables that become cards on mobile
- Touch-friendly interfaces
- Responsive navigation
- Optimized for all screen sizes

## 🔄 API Integration

The system includes mock API routes for all entities:
- `/api/users` - User management
- `/api/devices` - Device management
- `/api/incidents` - Incident management
- `/api/projects` - Project management
- `/api/departments` - Department management

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Next.js, React, and TypeScript** 
>>>>>>> 3561314 (fix: add explicit type for skill in technician map to resolve TS error)
