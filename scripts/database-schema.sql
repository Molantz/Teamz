-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Profiles
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id UUID REFERENCES departments(id),
    position VARCHAR(100),
    supervisor_id UUID REFERENCES employees(id),
    manager_id UUID REFERENCES employees(id),
    hire_date DATE,
    avatar_url TEXT,
    signature_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    manager_id UUID REFERENCES employees(id),
    budget DECIMAL(12,2),
    budget_utilization DECIMAL(5,2) DEFAULT 0, -- Percentage of budget used
    location VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'pending'
    parent_department_id UUID REFERENCES departments(id), -- For hierarchical structure
    level INTEGER DEFAULT 1, -- Organizational level
    employee_count INTEGER DEFAULT 0,
    device_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Budget History
CREATE TABLE department_budget_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    fiscal_year VARCHAR(4) NOT NULL,
    budget_amount DECIMAL(12,2) NOT NULL,
    spent_amount DECIMAL(12,2) DEFAULT 0,
    utilization_percentage DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Resources
CREATE TABLE department_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'employee', 'device', 'software', 'equipment'
    resource_id UUID, -- References employees(id) or devices(id)
    resource_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    cost_per_unit DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    assigned_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Activities/Events
CREATE TABLE department_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'meeting', 'training', 'project', 'maintenance'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    attendees JSONB, -- Array of employee IDs
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    priority VARCHAR(20) DEFAULT 'medium',
    created_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Goals and KPIs
CREATE TABLE department_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- 'financial', 'operational', 'strategic', 'performance'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(12,2),
    current_value DECIMAL(12,2) DEFAULT 0,
    unit VARCHAR(50), -- 'percentage', 'currency', 'count', 'hours'
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'overdue', 'cancelled'
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    created_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Documents
CREATE TABLE department_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'policy', 'procedure', 'contract', 'report'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'draft'
    expiry_date DATE,
    uploaded_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Communication Channels
CREATE TABLE department_communication (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    channel_type VARCHAR(50) NOT NULL, -- 'email', 'slack', 'teams', 'phone', 'meeting'
    channel_name VARCHAR(255) NOT NULL,
    channel_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Workflows
CREATE TABLE department_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    workflow_name VARCHAR(255) NOT NULL,
    workflow_type VARCHAR(50) NOT NULL, -- 'approval', 'request', 'notification', 'escalation'
    description TEXT,
    steps JSONB NOT NULL, -- Array of workflow steps
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department Integrations
CREATE TABLE department_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL, -- 'crm', 'erp', 'hr', 'finance', 'project_management'
    integration_name VARCHAR(255) NOT NULL,
    api_endpoint TEXT,
    api_key_hash VARCHAR(255), -- Hashed API key for security
    configuration JSONB,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Devices
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    serial_number VARCHAR(255) UNIQUE,
    model VARCHAR(255),
    manufacturer VARCHAR(255),
    purchase_date DATE,
    warranty_expiry DATE,
    cost DECIMAL(10,2),
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'available',
    condition VARCHAR(20) DEFAULT 'excellent',
    assigned_to UUID REFERENCES employees(id),
    assigned_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'planned',
    priority VARCHAR(20) DEFAULT 'medium',
    budget DECIMAL(12,2),
    spent DECIMAL(12,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    manager_id UUID REFERENCES employees(id),
    department_id UUID REFERENCES departments(id),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Assignments
CREATE TABLE project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    role VARCHAR(100),
    assigned_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    category VARCHAR(50),
    reporter_id UUID REFERENCES employees(id),
    assignee_id UUID REFERENCES employees(id),
    affected_users INTEGER DEFAULT 0,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Service Requests
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    requester_id UUID REFERENCES employees(id),
    approver_id UUID REFERENCES employees(id),
    estimated_cost DECIMAL(10,2),
    justification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    fulfilled_at TIMESTAMP WITH TIME ZONE
);

-- Activities/Time Tracking
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    employee_id UUID REFERENCES employees(id),
    project_id UUID REFERENCES projects(id),
    duration_minutes INTEGER,
    date DATE DEFAULT CURRENT_DATE,
    start_time TIME,
    end_time TIME,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    uploaded_by UUID REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'on-demand'
    parameters JSONB,
    recipients JSONB, -- Array of email addresses
    schedule_time TIME,
    schedule_day INTEGER, -- Day of week (0-6) or day of month (1-31)
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES employees(id),
    last_generated TIMESTAMP WITH TIME ZONE,
    next_generation TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Executions
CREATE TABLE report_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    file_url TEXT,
    error_message TEXT,
    execution_time_ms INTEGER,
    recipients_sent JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    category VARCHAR(50),
    description TEXT,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_supervisor ON employees(supervisor_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);

-- Department indexes
CREATE INDEX idx_departments_status ON departments(status);
CREATE INDEX idx_departments_manager ON departments(manager_id);
CREATE INDEX idx_departments_parent ON departments(parent_department_id);
CREATE INDEX idx_departments_level ON departments(level);
CREATE INDEX idx_departments_code ON departments(code);
CREATE INDEX idx_departments_budget_utilization ON departments(budget_utilization);

-- Department budget history indexes
CREATE INDEX idx_department_budget_history_department ON department_budget_history(department_id);
CREATE INDEX idx_department_budget_history_fiscal_year ON department_budget_history(fiscal_year);
CREATE INDEX idx_department_budget_history_created_by ON department_budget_history(created_by);

-- Department resources indexes
CREATE INDEX idx_department_resources_department ON department_resources(department_id);
CREATE INDEX idx_department_resources_type ON department_resources(resource_type);
CREATE INDEX idx_department_resources_status ON department_resources(status);
CREATE INDEX idx_department_resources_resource_id ON department_resources(resource_id);

-- Department activities indexes
CREATE INDEX idx_department_activities_department ON department_activities(department_id);
CREATE INDEX idx_department_activities_type ON department_activities(activity_type);
CREATE INDEX idx_department_activities_status ON department_activities(status);
CREATE INDEX idx_department_activities_dates ON department_activities(start_date, end_date);
CREATE INDEX idx_department_activities_created_by ON department_activities(created_by);

-- Department goals indexes
CREATE INDEX idx_department_goals_department ON department_goals(department_id);
CREATE INDEX idx_department_goals_type ON department_goals(goal_type);
CREATE INDEX idx_department_goals_status ON department_goals(status);
CREATE INDEX idx_department_goals_target_date ON department_goals(target_date);
CREATE INDEX idx_department_goals_created_by ON department_goals(created_by);

-- Department documents indexes
CREATE INDEX idx_department_documents_department ON department_documents(department_id);
CREATE INDEX idx_department_documents_type ON department_documents(document_type);
CREATE INDEX idx_department_documents_status ON department_documents(status);
CREATE INDEX idx_department_documents_uploaded_by ON department_documents(uploaded_by);

-- Department communication indexes
CREATE INDEX idx_department_communication_department ON department_communication(department_id);
CREATE INDEX idx_department_communication_type ON department_communication(channel_type);
CREATE INDEX idx_department_communication_active ON department_communication(is_active);

-- Department workflows indexes
CREATE INDEX idx_department_workflows_department ON department_workflows(department_id);
CREATE INDEX idx_department_workflows_type ON department_workflows(workflow_type);
CREATE INDEX idx_department_workflows_active ON department_workflows(is_active);

-- Department integrations indexes
CREATE INDEX idx_department_integrations_department ON department_integrations(department_id);
CREATE INDEX idx_department_integrations_type ON department_integrations(integration_type);
CREATE INDEX idx_department_integrations_active ON department_integrations(is_active);

-- Other important indexes
CREATE INDEX idx_devices_assigned_to ON devices(assigned_to);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_incidents_assignee ON incidents(assignee_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);
CREATE INDEX idx_activities_employee ON activities(employee_id);
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_project ON activities(project_id);
CREATE INDEX idx_reports_frequency ON reports(frequency);
CREATE INDEX idx_reports_next_generation ON reports(next_generation);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Enable RLS for new department tables
ALTER TABLE department_budget_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_communication ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Basic examples - customize based on your needs)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Employees can view their own profile" ON employees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Managers can view their department" ON employees FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM employees e 
        WHERE e.user_id = auth.uid() 
        AND (e.id = manager_id OR e.department_id = department_id)
    )
);

-- Sample data for enhanced department management
INSERT INTO departments (id, name, code, manager_id, budget, budget_utilization, location, description, status, level, employee_count, device_count) VALUES
('dept-001', 'Information Technology', 'IT', 'emp-001', 125000.00, 85.5, 'Building A, Floor 3', 'Manages all IT infrastructure, support, and development', 'active', 1, 25, 78),
('dept-002', 'Human Resources', 'HR', 'emp-002', 45000.00, 72.3, 'Building A, Floor 2', 'Employee relations, recruitment, and organizational development', 'active', 1, 12, 24),
('dept-003', 'Engineering', 'ENG', 'emp-003', 200000.00, 92.1, 'Building B, Floor 1-2', 'Product development, software engineering, and technical innovation', 'active', 1, 45, 135),
('dept-004', 'Marketing', 'MKT', 'emp-004', 75000.00, 68.7, 'Building A, Floor 1', 'Brand management, digital marketing, and customer engagement', 'active', 1, 18, 36),
('dept-005', 'Finance', 'FIN', 'emp-005', 60000.00, 45.2, 'Building A, Floor 4', 'Financial planning, accounting, and budget management', 'active', 1, 15, 30),
('dept-006', 'Operations', 'OPS', 'emp-006', 90000.00, 78.9, 'Building C, Floor 1', 'Business operations, process optimization, and efficiency', 'active', 1, 22, 55);

-- Sample department budget history
INSERT INTO department_budget_history (department_id, fiscal_year, budget_amount, spent_amount, utilization_percentage, notes, created_by) VALUES
('dept-001', '2024', 125000.00, 106875.00, 85.5, 'IT infrastructure upgrades and software licenses', 'emp-001'),
('dept-002', '2024', 45000.00, 32535.00, 72.3, 'HR system implementation and training programs', 'emp-002'),
('dept-003', '2024', 200000.00, 184200.00, 92.1, 'Engineering tools and development resources', 'emp-003'),
('dept-004', '2024', 75000.00, 51525.00, 68.7, 'Marketing campaigns and digital tools', 'emp-004'),
('dept-005', '2024', 60000.00, 27120.00, 45.2, 'Financial software and compliance tools', 'emp-005'),
('dept-006', '2024', 90000.00, 71010.00, 78.9, 'Operations optimization and process automation', 'emp-006');

-- Sample department resources
INSERT INTO department_resources (department_id, resource_type, resource_id, resource_name, quantity, cost_per_unit, total_cost, status, notes) VALUES
('dept-001', 'software', NULL, 'Microsoft 365 Enterprise', 25, 36.00, 900.00, 'active', 'Annual subscription for IT department'),
('dept-001', 'equipment', NULL, 'Dell Latitude Laptops', 25, 1200.00, 30000.00, 'active', 'Standard issue laptops for IT staff'),
('dept-002', 'software', NULL, 'BambooHR System', 12, 8.00, 96.00, 'active', 'HR management system'),
('dept-003', 'software', NULL, 'JetBrains IDE Suite', 45, 199.00, 8955.00, 'active', 'Development tools for engineering team'),
('dept-004', 'software', NULL, 'Adobe Creative Suite', 18, 52.99, 953.82, 'active', 'Design tools for marketing team'),
('dept-005', 'software', NULL, 'QuickBooks Enterprise', 15, 1200.00, 18000.00, 'active', 'Accounting software for finance team');

-- Sample department activities
INSERT INTO department_activities (department_id, activity_type, title, description, start_date, end_date, start_time, end_time, location, attendees, status, priority, created_by) VALUES
('dept-001', 'meeting', 'Weekly IT Team Standup', 'Daily standup meeting for IT team updates', '2024-01-15', '2024-01-15', '09:00:00', '09:30:00', 'Conference Room A', '["emp-001", "emp-007", "emp-008"]', 'completed', 'medium', 'emp-001'),
('dept-002', 'training', 'New Employee Onboarding', 'Comprehensive onboarding program for new hires', '2024-01-20', '2024-01-20', '10:00:00', '16:00:00', 'Training Room B', '["emp-002", "emp-009", "emp-010"]', 'scheduled', 'high', 'emp-002'),
('dept-003', 'project', 'Product Launch Planning', 'Planning session for Q2 product launch', '2024-01-25', '2024-01-25', '14:00:00', '17:00:00', 'Conference Room C', '["emp-003", "emp-011", "emp-012"]', 'scheduled', 'high', 'emp-003'),
('dept-004', 'meeting', 'Marketing Campaign Review', 'Monthly review of marketing campaign performance', '2024-01-30', '2024-01-30', '11:00:00', '12:00:00', 'Conference Room D', '["emp-004", "emp-013", "emp-014"]', 'scheduled', 'medium', 'emp-004');

-- Sample department goals
INSERT INTO department_goals (department_id, goal_type, title, description, target_value, current_value, unit, target_date, status, progress_percentage, created_by) VALUES
('dept-001', 'operational', 'Reduce System Downtime', 'Achieve 99.9% system uptime', 99.9, 98.5, 'percentage', '2024-12-31', 'active', 65.0, 'emp-001'),
('dept-002', 'strategic', 'Improve Employee Satisfaction', 'Increase employee satisfaction score to 85%', 85.0, 78.0, 'percentage', '2024-06-30', 'active', 45.0, 'emp-002'),
('dept-003', 'financial', 'Reduce Development Costs', 'Reduce development costs by 15%', 15.0, 8.0, 'percentage', '2024-09-30', 'active', 53.0, 'emp-003'),
('dept-004', 'performance', 'Increase Lead Generation', 'Generate 500 new leads per month', 500.0, 320.0, 'count', '2024-08-31', 'active', 64.0, 'emp-004'),
('dept-005', 'financial', 'Improve Budget Accuracy', 'Achieve 95% budget forecast accuracy', 95.0, 88.0, 'percentage', '2024-12-31', 'active', 70.0, 'emp-005'),
('dept-006', 'operational', 'Process Automation', 'Automate 80% of manual processes', 80.0, 45.0, 'percentage', '2024-10-31', 'active', 56.0, 'emp-006');

-- Sample department documents
INSERT INTO department_documents (department_id, document_type, title, description, file_url, file_size, mime_type, version, status, uploaded_by) VALUES
('dept-001', 'policy', 'IT Security Policy', 'Comprehensive IT security guidelines and procedures', '/documents/it-security-policy.pdf', 2048576, 'application/pdf', '2.1', 'active', 'emp-001'),
('dept-002', 'procedure', 'Employee Onboarding Process', 'Step-by-step employee onboarding procedure', '/documents/onboarding-process.pdf', 1536000, 'application/pdf', '1.5', 'active', 'emp-002'),
('dept-003', 'contract', 'Software License Agreement', 'Enterprise software license agreement', '/documents/software-license.pdf', 3072000, 'application/pdf', '1.0', 'active', 'emp-003'),
('dept-004', 'report', 'Q4 Marketing Performance Report', 'Quarterly marketing performance analysis', '/documents/q4-marketing-report.pdf', 4096000, 'application/pdf', '1.0', 'active', 'emp-004');

-- Sample department communication channels
INSERT INTO department_communication (department_id, channel_type, channel_name, channel_url, description, is_active, created_by) VALUES
('dept-001', 'slack', 'IT Team Channel', 'https://company.slack.com/channels/it-team', 'Primary communication channel for IT team', true, 'emp-001'),
('dept-002', 'email', 'HR Announcements', 'hr-announcements@company.com', 'Email list for HR announcements', true, 'emp-002'),
('dept-003', 'teams', 'Engineering Team', 'https://teams.microsoft.com/engineering', 'Microsoft Teams channel for engineering team', true, 'emp-003'),
('dept-004', 'slack', 'Marketing Team', 'https://company.slack.com/channels/marketing', 'Marketing team collaboration channel', true, 'emp-004'),
('dept-005', 'email', 'Finance Updates', 'finance-updates@company.com', 'Finance department email updates', true, 'emp-005'),
('dept-006', 'teams', 'Operations Team', 'https://teams.microsoft.com/operations', 'Operations team collaboration space', true, 'emp-006');

-- Sample department workflows
INSERT INTO department_workflows (department_id, workflow_name, workflow_type, description, steps, is_active, created_by) VALUES
('dept-001', 'IT Support Request', 'request', 'Workflow for IT support ticket processing', '[
  {"step": 1, "action": "Submit Request", "assignee": "user", "timeout": "0"},
  {"step": 2, "action": "Initial Review", "assignee": "emp-001", "timeout": "4h"},
  {"step": 3, "action": "Technical Assessment", "assignee": "emp-007", "timeout": "8h"},
  {"step": 4, "action": "Resolution", "assignee": "emp-007", "timeout": "24h"},
  {"step": 5, "action": "User Confirmation", "assignee": "user", "timeout": "48h"}
]', true, 'emp-001'),
('dept-002', 'Employee Onboarding', 'approval', 'New employee onboarding workflow', '[
  {"step": 1, "action": "HR Review", "assignee": "emp-002", "timeout": "24h"},
  {"step": 2, "action": "Manager Approval", "assignee": "department_manager", "timeout": "48h"},
  {"step": 3, "action": "IT Setup", "assignee": "emp-001", "timeout": "72h"},
  {"step": 4, "action": "Final Review", "assignee": "emp-002", "timeout": "24h"}
]', true, 'emp-002'),
('dept-003', 'Code Review Process', 'approval', 'Software code review workflow', '[
  {"step": 1, "action": "Developer Submission", "assignee": "developer", "timeout": "0"},
  {"step": 2, "action": "Peer Review", "assignee": "peer_reviewer", "timeout": "24h"},
  {"step": 3, "action": "Senior Review", "assignee": "emp-003", "timeout": "48h"},
  {"step": 4, "action": "Merge Approval", "assignee": "emp-003", "timeout": "24h"}
]', true, 'emp-003');

-- Sample department integrations
INSERT INTO department_integrations (department_id, integration_type, integration_name, api_endpoint, configuration, is_active, created_by) VALUES
('dept-001', 'monitoring', 'New Relic APM', 'https://api.newrelic.com/v2', '{"api_key": "hash_placeholder", "app_id": "12345"}', true, 'emp-001'),
('dept-002', 'hr', 'BambooHR API', 'https://api.bamboohr.com/api/gateway.php', '{"api_key": "hash_placeholder", "subdomain": "company"}', true, 'emp-002'),
('dept-003', 'project_management', 'Jira Integration', 'https://company.atlassian.net/rest/api/3', '{"api_token": "hash_placeholder", "project_key": "ENG"}', true, 'emp-003'),
('dept-004', 'marketing', 'HubSpot CRM', 'https://api.hubapi.com', '{"api_key": "hash_placeholder", "portal_id": "123456"}', true, 'emp-004'),
('dept-005', 'finance', 'QuickBooks API', 'https://quickbooks.api.intuit.com/v3', '{"client_id": "hash_placeholder", "client_secret": "hash_placeholder"}', true, 'emp-005'),
('dept-006', 'operations', 'ServiceNow Integration', 'https://company.service-now.com/api/now', '{"username": "hash_placeholder", "password": "hash_placeholder"}', true, 'emp-006');
