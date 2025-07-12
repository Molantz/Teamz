-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL DEFAULT 'Employee',
  department VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  last_login TIMESTAMP WITH TIME ZONE,
  avatar VARCHAR(500),
  phone VARCHAR(50),
  position VARCHAR(100),
  employee_id VARCHAR(100),
  join_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  model VARCHAR(255),
  serial_number VARCHAR(255),
  manufacturer VARCHAR(255),
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  warranty_expiry DATE,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  assigned_to UUID REFERENCES users(id),
  notes TEXT,
  specifications TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
  description TEXT NOT NULL,
  affected_user VARCHAR(255),
  affected_device VARCHAR(255),
  department VARCHAR(100),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'New',
  assignee UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requests table
CREATE TABLE requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
  description TEXT NOT NULL,
  requester VARCHAR(255),
  department VARCHAR(100),
  budget DECIMAL(10,2),
  expected_delivery DATE,
  justification TEXT NOT NULL,
  impact TEXT,
  alternatives TEXT,
  attachments TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assignments table
CREATE TABLE assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES assets(id),
  user_id UUID NOT NULL REFERENCES users(id),
  assignment_type VARCHAR(100) NOT NULL,
  assignment_date DATE NOT NULL,
  expected_return_date DATE,
  reason TEXT NOT NULL,
  notes TEXT,
  terms TEXT,
  supervisor VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255),
  details TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_assigned_to ON assets(assigned_to);

CREATE INDEX idx_incidents_category ON incidents(category);
CREATE INDEX idx_incidents_priority ON incidents(priority);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_assignee ON incidents(assignee);

CREATE INDEX idx_requests_type ON requests(type);
CREATE INDEX idx_requests_priority ON requests(priority);
CREATE INDEX idx_requests_status ON requests(status);

CREATE INDEX idx_assignments_device_id ON assignments(device_id);
CREATE INDEX idx_assignments_user_id ON assignments(user_id);
CREATE INDEX idx_assignments_status ON assignments(status);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (name, email, role, department, status, phone, position, employee_id, join_date) VALUES
('John Smith', 'john.smith@company.com', 'Admin', 'IT Support', 'Active', '+2348012345678', 'Senior IT Technician', 'EMP001', '2023-01-15'),
('Sarah Johnson', 'sarah.johnson@company.com', 'Manager', 'Network Team', 'Active', '+2348098765432', 'Network Manager', 'EMP002', '2023-02-20'),
('Mike Wilson', 'mike.wilson@company.com', 'Technician', 'Hardware Support', 'Active', '+2348055555555', 'Hardware Technician', 'EMP003', '2023-03-10'),
('Lisa Brown', 'lisa.brown@company.com', 'Employee', 'Software Support', 'Active', '+2348077777777', 'Software Developer', 'EMP004', '2023-04-05');

INSERT INTO assets (name, type, model, serial_number, manufacturer, purchase_date, purchase_price, location, status) VALUES
('Dell Latitude 5520', 'Laptop', 'Latitude 5520', 'DL001234567', 'Dell Inc.', '2023-01-15', 1200.00, 'Head Office', 'Available'),
('HP EliteBook 840', 'Laptop', 'EliteBook 840', 'HP001234567', 'HP Inc.', '2023-02-20', 1100.00, 'Head Office', 'Available'),
('Dell OptiPlex 7090', 'Desktop', 'OptiPlex 7090', 'DL002345678', 'Dell Inc.', '2023-03-10', 800.00, 'Branch Office A', 'Available'),
('Dell P2419H Monitor', 'Monitor', 'P2419H', 'DL003456789', 'Dell Inc.', '2023-04-05', 300.00, 'Head Office', 'Available'),
('HP LaserJet Pro', 'Printer', 'LaserJet Pro', 'HP004567890', 'HP Inc.', '2023-05-12', 500.00, 'Head Office', 'Available');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication setup)
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON users FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON assets FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON assets FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON assets FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON incidents FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON incidents FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON incidents FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON requests FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON requests FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON requests FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON assignments FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON assignments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users" ON assignments FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON audit_logs FOR INSERT WITH CHECK (true); 