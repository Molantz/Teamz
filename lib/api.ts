import { 
  supabase, 
  User, 
  Asset, 
  Incident, 
  Request, 
  Assignment, 
  Department, 
  DepartmentBudgetHistory, 
  DepartmentResource, 
  DepartmentActivity, 
  DepartmentGoal, 
  DepartmentDocument, 
  DepartmentCommunication, 
  DepartmentWorkflow, 
  DepartmentIntegration,
  PurchaseRequest,
  PRItem,
  PRStatusHistory,
  PRApproval,
  PRNotification,
  PRAttachment,
  PRComment,
  Project,
  Report,
  AirtimeBundle
} from './supabase'

import {
  AssignmentAction,
  Notification,
  NotificationSettings,
  PRSearchFilters,
  ExportOptions,
  PRDetails,
  UserRole,
  RolePermissions,
  Permission
} from './types'

// Users API
export const usersApi = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Assets API
export const assetsApi = {
  async getAll(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(assetData: Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .insert([assetData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, assetData: Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .update(assetData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Incidents API
export const incidentsApi = {
  async getAll(): Promise<Incident[]> {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Incident | null> {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(incidentData: Partial<Incident>): Promise<Incident> {
    const { data, error } = await supabase
      .from('incidents')
      .insert([incidentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, incidentData: Partial<Incident>): Promise<Incident> {
    const { data, error } = await supabase
      .from('incidents')
      .update(incidentData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('incidents')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Requests API
export const requestsApi = {
  async getAll(): Promise<Request[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Request | null> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(requestData: Partial<Request>): Promise<Request> {
    const { data, error } = await supabase
      .from('requests')
      .insert([requestData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, requestData: Partial<Request>): Promise<Request> {
    const { data, error } = await supabase
      .from('requests')
      .update(requestData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Assignments API
export const assignmentsApi = {
  async getAll(): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Assignment | null> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(assignmentData: Partial<Assignment>): Promise<Assignment> {
    const { data, error } = await supabase
      .from('assignments')
      .insert([assignmentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, assignmentData: Partial<Assignment>): Promise<Assignment> {
    const { data, error } = await supabase
      .from('assignments')
      .update(assignmentData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Departments API
export const departmentsApi = {
  async getAll(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Department | null> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(departmentData: Partial<Department>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert([departmentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, departmentData: Partial<Department>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update(departmentData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Department Budget History
  async getBudgetHistory(departmentId: string): Promise<DepartmentBudgetHistory[]> {
    const { data, error } = await supabase
      .from('department_budget_history')
      .select('*')
      .eq('department_id', departmentId)
      .order('fiscal_year', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addBudgetHistory(budgetData: Partial<DepartmentBudgetHistory>): Promise<DepartmentBudgetHistory> {
    const { data, error } = await supabase
      .from('department_budget_history')
      .insert([budgetData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Department Resources
  async getResources(departmentId: string): Promise<DepartmentResource[]> {
    const { data, error } = await supabase
      .from('department_resources')
      .select('*')
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addResource(resourceData: Partial<DepartmentResource>): Promise<DepartmentResource> {
    const { data, error } = await supabase
      .from('department_resources')
      .insert([resourceData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateResource(id: string, resourceData: Partial<DepartmentResource>): Promise<DepartmentResource> {
    const { data, error } = await supabase
      .from('department_resources')
      .update(resourceData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteResource(id: string): Promise<void> {
    const { error } = await supabase
      .from('department_resources')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Department Activities
  async getActivities(departmentId: string): Promise<DepartmentActivity[]> {
    const { data, error } = await supabase
      .from('department_activities')
      .select('*')
      .eq('department_id', departmentId)
      .order('start_date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addActivity(activityData: Partial<DepartmentActivity>): Promise<DepartmentActivity> {
    const { data, error } = await supabase
      .from('department_activities')
      .insert([activityData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateActivity(id: string, activityData: Partial<DepartmentActivity>): Promise<DepartmentActivity> {
    const { data, error } = await supabase
      .from('department_activities')
      .update(activityData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteActivity(id: string): Promise<void> {
    const { error } = await supabase
      .from('department_activities')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Department Goals
  async getGoals(departmentId: string): Promise<DepartmentGoal[]> {
    const { data, error } = await supabase
      .from('department_goals')
      .select('*')
      .eq('department_id', departmentId)
      .order('target_date', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async addGoal(goalData: Partial<DepartmentGoal>): Promise<DepartmentGoal> {
    const { data, error } = await supabase
      .from('department_goals')
      .insert([goalData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateGoal(id: string, goalData: Partial<DepartmentGoal>): Promise<DepartmentGoal> {
    const { data, error } = await supabase
      .from('department_goals')
      .update(goalData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('department_goals')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Department Documents
  async getDocuments(departmentId: string): Promise<DepartmentDocument[]> {
    const { data, error } = await supabase
      .from('department_documents')
      .select('*')
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addDocument(documentData: Partial<DepartmentDocument>): Promise<DepartmentDocument> {
    const { data, error } = await supabase
      .from('department_documents')
      .insert([documentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateDocument(id: string, documentData: Partial<DepartmentDocument>): Promise<DepartmentDocument> {
    const { data, error } = await supabase
      .from('department_documents')
      .update(documentData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('department_documents')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Department Communication
  async getCommunicationChannels(departmentId: string): Promise<DepartmentCommunication[]> {
    const { data, error } = await supabase
      .from('department_communication')
      .select('*')
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addCommunicationChannel(channelData: Partial<DepartmentCommunication>): Promise<DepartmentCommunication> {
    const { data, error } = await supabase
      .from('department_communication')
      .insert([channelData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateCommunicationChannel(id: string, channelData: Partial<DepartmentCommunication>): Promise<DepartmentCommunication> {
    const { data, error } = await supabase
      .from('department_communication')
      .update(channelData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteCommunicationChannel(id: string): Promise<void> {
    const { error } = await supabase
      .from('department_communication')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Department Workflows
  async getWorkflows(departmentId: string): Promise<DepartmentWorkflow[]> {
    const { data, error } = await supabase
      .from('department_workflows')
      .select('*')
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addWorkflow(workflowData: Partial<DepartmentWorkflow>): Promise<DepartmentWorkflow> {
    const { data, error } = await supabase
      .from('department_workflows')
      .insert([workflowData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateWorkflow(id: string, workflowData: Partial<DepartmentWorkflow>): Promise<DepartmentWorkflow> {
    const { data, error } = await supabase
      .from('department_workflows')
      .update(workflowData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabase
      .from('department_workflows')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Department Integrations
  async getIntegrations(departmentId: string): Promise<DepartmentIntegration[]> {
    const { data, error } = await supabase
      .from('department_integrations')
      .select('*')
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addIntegration(integrationData: Partial<DepartmentIntegration>): Promise<DepartmentIntegration> {
    const { data, error } = await supabase
      .from('department_integrations')
      .insert([integrationData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateIntegration(id: string, integrationData: Partial<DepartmentIntegration>): Promise<DepartmentIntegration> {
    const { data, error } = await supabase
      .from('department_integrations')
      .update(integrationData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteIntegration(id: string): Promise<void> {
    const { error } = await supabase
      .from('department_integrations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
} 

// PR Management API
export const prApi = {
  // Purchase Requests
  async getAllPRs(): Promise<PurchaseRequest[]> {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getPRById(id: string): Promise<PurchaseRequest | null> {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getPRByNumber(prNumber: string): Promise<PurchaseRequest | null> {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select('*')
      .eq('pr_number', prNumber)
      .single()
    
    if (error) throw error
    return data
  },

  async createPR(prData: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
    const { data, error } = await supabase
      .from('purchase_requests')
      .insert([prData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePR(id: string, prData: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
    const { data, error } = await supabase
      .from('purchase_requests')
      .update(prData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deletePR(id: string): Promise<void> {
    const { error } = await supabase
      .from('purchase_requests')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // PR Items
  async getPRItems(prId: string): Promise<PRItem[]> {
    const { data, error } = await supabase
      .from('pr_items')
      .select('*')
      .eq('pr_id', prId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addPRItem(itemData: Partial<PRItem>): Promise<PRItem> {
    const { data, error } = await supabase
      .from('pr_items')
      .insert([itemData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePRItem(id: string, itemData: Partial<PRItem>): Promise<PRItem> {
    const { data, error } = await supabase
      .from('pr_items')
      .update(itemData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deletePRItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('pr_items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // PR Status History
  async getPRStatusHistory(prId: string): Promise<PRStatusHistory[]> {
    const { data, error } = await supabase
      .from('pr_status_history')
      .select('*')
      .eq('pr_id', prId)
      .order('changed_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addStatusHistory(historyData: Partial<PRStatusHistory>): Promise<PRStatusHistory> {
    const { data, error } = await supabase
      .from('pr_status_history')
      .insert([historyData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // PR Approvals
  async getPRApprovals(prId: string): Promise<PRApproval[]> {
    const { data, error } = await supabase
      .from('pr_approvals')
      .select('*')
      .eq('pr_id', prId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addPRApproval(approvalData: Partial<PRApproval>): Promise<PRApproval> {
    const { data, error } = await supabase
      .from('pr_approvals')
      .insert([approvalData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePRApproval(id: string, approvalData: Partial<PRApproval>): Promise<PRApproval> {
    const { data, error } = await supabase
      .from('pr_approvals')
      .update(approvalData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // PR Notifications
  async getPRNotifications(prId: string): Promise<PRNotification[]> {
    const { data, error } = await supabase
      .from('pr_notifications')
      .select('*')
      .eq('pr_id', prId)
      .order('sent_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addPRNotification(notificationData: Partial<PRNotification>): Promise<PRNotification> {
    const { data, error } = await supabase
      .from('pr_notifications')
      .insert([notificationData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('pr_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  },

  // PR Attachments
  async getPRAttachments(prId: string): Promise<PRAttachment[]> {
    const { data, error } = await supabase
      .from('pr_attachments')
      .select('*')
      .eq('pr_id', prId)
      .order('uploaded_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addPRAttachment(attachmentData: Partial<PRAttachment>): Promise<PRAttachment> {
    const { data, error } = await supabase
      .from('pr_attachments')
      .insert([attachmentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deletePRAttachment(id: string): Promise<void> {
    const { error } = await supabase
      .from('pr_attachments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // PR Comments
  async getPRComments(prId: string): Promise<PRComment[]> {
    const { data, error } = await supabase
      .from('pr_comments')
      .select('*')
      .eq('pr_id', prId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async addPRComment(commentData: Partial<PRComment>): Promise<PRComment> {
    const { data, error } = await supabase
      .from('pr_comments')
      .insert([commentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deletePRComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('pr_comments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Advanced PR Operations
  async updatePRStatus(prId: string, newStatus: string, changedBy: string, remarks?: string): Promise<void> {
    // Update PR status
    await this.updatePR(prId, { status: newStatus })
    
    // Add status history
    await this.addStatusHistory({
      pr_id: prId,
      status: newStatus,
      remarks,
      changed_by: changedBy
    })
  },

  async assignPRToEmployee(prId: string, employeeId: string): Promise<void> {
    await this.updatePR(prId, { assigned_to_id: employeeId })
  },

  async linkPRItemToInventory(itemId: string, inventoryItemId: string, employeeId?: string): Promise<void> {
    const updateData: Partial<PRItem> = {
      inventory_item_id: inventoryItemId,
      status: 'delivered',
      delivery_status: 'delivered'
    }
    
    if (employeeId) {
      updateData.assigned_to_employee_id = employeeId
    }
    
    await this.updatePRItem(itemId, updateData)
  },

  async getPRsByStatus(status: string): Promise<PurchaseRequest[]> {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getPRsByRequester(requesterId: string): Promise<PurchaseRequest[]> {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select('*')
      .eq('requester_id', requesterId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getPRsByDepartment(departmentId: string): Promise<PurchaseRequest[]> {
    const { data, error } = await supabase
      .from('purchase_requests')
      .select('*')
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
} 

// Projects API
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(projectData: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Reports API
export const reportsApi = {
  async getAll(): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(reportData: Partial<Report>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, reportData: Partial<Report>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .update(reportData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Airtime Bundles API
export const airtimeBundlesApi = {
  async getAll(): Promise<AirtimeBundle[]> {
    const { data, error } = await supabase
      .from('airtime_bundles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<AirtimeBundle | null> {
    const { data, error } = await supabase
      .from('airtime_bundles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(bundleData: Partial<AirtimeBundle>): Promise<AirtimeBundle> {
    const { data, error } = await supabase
      .from('airtime_bundles')
      .insert([bundleData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, bundleData: Partial<AirtimeBundle>): Promise<AirtimeBundle> {
    const { data, error } = await supabase
      .from('airtime_bundles')
      .update(bundleData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('airtime_bundles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Assignment Actions API
export async function createAssignmentAction(action: Omit<AssignmentAction, 'id' | 'assigned_at'>): Promise<AssignmentAction> {
  const response = await fetch('/api/assignment-actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action),
  });
  if (!response.ok) throw new Error('Failed to create assignment action');
  return response.json();
}

export async function getAssignmentActions(prItemId?: string): Promise<AssignmentAction[]> {
  const params = prItemId ? `?pr_item_id=${prItemId}` : '';
  const response = await fetch(`/api/assignment-actions${params}`);
  if (!response.ok) throw new Error('Failed to fetch assignment actions');
  return response.json();
}

export async function updateAssignmentAction(id: string, updates: Partial<AssignmentAction>): Promise<AssignmentAction> {
  const response = await fetch(`/api/assignment-actions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update assignment action');
  return response.json();
}

// Notifications API
export async function getNotifications(userId?: string, unreadOnly = false): Promise<Notification[]> {
  const params = new URLSearchParams();
  if (userId) params.append('user_id', userId);
  if (unreadOnly) params.append('unread_only', 'true');
  
  const response = await fetch(`/api/notifications?${params}`);
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const response = await fetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to mark notification as read');
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const response = await fetch(`/api/notifications/mark-all-read`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!response.ok) throw new Error('Failed to mark all notifications as read');
}

export async function createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<Notification> {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });
  if (!response.ok) throw new Error('Failed to create notification');
  return response.json();
}

export async function getNotificationSettings(userId: string): Promise<NotificationSettings> {
  const response = await fetch(`/api/notification-settings/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch notification settings');
  return response.json();
}

export async function updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
  const response = await fetch(`/api/notification-settings/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error('Failed to update notification settings');
  return response.json();
}

// Enhanced PR Search and Filter
export async function searchPurchaseRequests(filters: PRSearchFilters): Promise<PurchaseRequest[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value.toString());
      }
    }
  });
  
  const response = await fetch(`/api/purchase-requests/search?${params}`);
  if (!response.ok) throw new Error('Failed to search purchase requests');
  return response.json();
}

export async function exportPurchaseRequests(options: ExportOptions): Promise<Blob> {
  const response = await fetch('/api/purchase-requests/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  if (!response.ok) throw new Error('Failed to export purchase requests');
  return response.blob();
}

// Detailed PR View
export async function getPRDetails(prId: string): Promise<PRDetails> {
  const response = await fetch(`/api/purchase-requests/${prId}/details`);
  if (!response.ok) throw new Error('Failed to fetch PR details');
  return response.json();
}

export async function getPRAuditTrail(prId: string): Promise<{
  status_history: PRStatusHistory[];
  approvals: PRApproval[];
  comments: PRComment[];
  assignment_actions: AssignmentAction[];
}> {
  const response = await fetch(`/api/purchase-requests/${prId}/audit-trail`);
  if (!response.ok) throw new Error('Failed to fetch PR audit trail');
  return response.json();
}

// Role-based Permissions
export async function getRolePermissions(role: UserRole): Promise<RolePermissions> {
  const response = await fetch(`/api/permissions/${role}`);
  if (!response.ok) throw new Error('Failed to fetch role permissions');
  return response.json();
}

export async function checkPermission(role: UserRole, resource: string, action: string): Promise<boolean> {
  const response = await fetch(`/api/permissions/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, resource, action }),
  });
  if (!response.ok) throw new Error('Failed to check permission');
  const result = await response.json();
  return result.granted;
}

export async function updatePermission(permission: Permission): Promise<Permission> {
  const response = await fetch(`/api/permissions/${permission.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(permission),
  });
  if (!response.ok) throw new Error('Failed to update permission');
  return response.json();
}

// Enhanced PR Management
export async function assignPRItemToInventory(prItemId: string, inventoryId: string, assignedBy: string, notes?: string): Promise<AssignmentAction> {
  const response = await fetch('/api/purchase-requests/assign-to-inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pr_item_id: prItemId, inventory_id: inventoryId, assigned_by: assignedBy, notes }),
  });
  if (!response.ok) throw new Error('Failed to assign PR item to inventory');
  return response.json();
}

export async function assignPRItemToUser(prItemId: string, userId: string, assignedBy: string, notes?: string): Promise<AssignmentAction> {
  const response = await fetch('/api/purchase-requests/assign-to-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pr_item_id: prItemId, user_id: userId, assigned_by: assignedBy, notes }),
  });
  if (!response.ok) throw new Error('Failed to assign PR item to user');
  return response.json();
}

export async function assignPRItemToDepartment(prItemId: string, departmentId: string, assignedBy: string, notes?: string): Promise<AssignmentAction> {
  const response = await fetch('/api/purchase-requests/assign-to-department', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pr_item_id: prItemId, department_id: departmentId, assigned_by: assignedBy, notes }),
  });
  if (!response.ok) throw new Error('Failed to assign PR item to department');
  return response.json();
}

// Notification Workflow
export async function sendPRNotification(notification: {
  user_id: string;
  title: string;
  message: string;
  type: Notification['type'];
  category: Notification['category'];
  related_id?: string;
  action_url?: string;
}): Promise<Notification> {
  return createNotification({
    ...notification,
  });
}

export async function sendBulkPRNotifications(notifications: Array<{
  user_id: string;
  title: string;
  message: string;
  type: Notification['type'];
  category: Notification['category'];
  related_id?: string;
  action_url?: string;
}>): Promise<Notification[]> {
  const response = await fetch('/api/notifications/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notifications }),
  });
  if (!response.ok) throw new Error('Failed to send bulk notifications');
  return response.json();
} 

// Advanced Alerts System API
export async function getAlerts(userId: string, filters?: any): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching alerts:', error)
    throw error
  }
}

export async function createAlert(alertData: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .insert([alertData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating alert:', error)
    throw error
  }
}

export async function updateAlert(alertId: string, updates: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', alertId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating alert:', error)
    throw error
  }
}

export async function deleteAlert(alertId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', alertId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting alert:', error)
    throw error
  }
}

// Alert Rules API
export async function getAlertRules(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('alert_rules')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching alert rules:', error)
    throw error
  }
}

export async function createAlertRule(ruleData: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('alert_rules')
      .insert([ruleData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating alert rule:', error)
    throw error
  }
}

export async function updateAlertRule(ruleId: string, updates: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('alert_rules')
      .update(updates)
      .eq('id', ruleId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating alert rule:', error)
    throw error
  }
}

// Real-time Dashboard API
export async function getDashboardMetrics(): Promise<any> {
  try {
    const [users, devices, incidents, requests] = await Promise.all([
      usersApi.getAll(),
      assetsApi.getAll(),
      incidentsApi.getAll(),
      requestsApi.getAll()
    ])

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'Active').length,
      totalDevices: devices.length,
      activeDevices: devices.filter(d => d.status === 'Assigned').length,
      openIncidents: incidents.filter(i => i.status === 'New' || i.status === 'In Progress').length,
      pendingRequests: requests.filter(r => r.status === 'Pending').length,
      systemUptime: 99.8,
      avgResponseTime: 2.3
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    throw error
  }
}

export async function getSystemStatus(): Promise<any[]> {
  try {
    // Mock system status data
    return [
      {
        id: '1',
        name: 'Main Database',
        status: 'online',
        uptime: 99.8,
        responseTime: 45,
        lastCheck: new Date()
      },
      {
        id: '2',
        name: 'API Gateway',
        status: 'online',
        uptime: 99.9,
        responseTime: 12,
        lastCheck: new Date()
      },
      {
        id: '3',
        name: 'File Storage',
        status: 'warning',
        uptime: 95.2,
        responseTime: 180,
        lastCheck: new Date()
      }
    ]
  } catch (error) {
    console.error('Error fetching system status:', error)
    throw error
  }
}

// Bulk Operations API
export async function bulkUpdateUsers(userIds: string[], updates: any): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .in('id', userIds)
      .select()

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error bulk updating users:', error)
    throw error
  }
}

export async function bulkDeleteUsers(userIds: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .in('id', userIds)

    if (error) throw error
  } catch (error) {
    console.error('Error bulk deleting users:', error)
    throw error
  }
}

export async function bulkUpdateDevices(deviceIds: string[], updates: any): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .update(updates)
      .in('id', deviceIds)
      .select()

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error bulk updating devices:', error)
    throw error
  }
}

export async function bulkDeleteDevices(deviceIds: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('assets')
      .delete()
      .in('id', deviceIds)

    if (error) throw error
  } catch (error) {
    console.error('Error bulk deleting devices:', error)
    throw error
  }
}

export async function bulkUpdateIncidents(incidentIds: string[], updates: any): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .update(updates)
      .in('id', incidentIds)
      .select()

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error bulk updating incidents:', error)
    throw error
  }
}

export async function bulkDeleteIncidents(incidentIds: string[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('incidents')
      .delete()
      .in('id', incidentIds)

    if (error) throw error
  } catch (error) {
    console.error('Error bulk deleting incidents:', error)
    throw error
  }
}

// Audit Trail API
export async function getAuditLogs(filters?: any): Promise<any[]> {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })

    if (filters) {
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id)
      }
      if (filters.action) {
        query = query.eq('action', filters.action)
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity)
      }
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.date_from) {
        query = query.gte('timestamp', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('timestamp', filters.date_to)
      }
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    throw error
  }
}

export async function createAuditLog(logData: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([logData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating audit log:', error)
    throw error
  }
}

export async function getAuditLogsByResource(resourceType: string, resourceId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching audit logs by resource:', error)
    throw error
  }
}

// Advanced Search API
export async function advancedSearch(table: string, filters: any): Promise<any[]> {
  try {
    let query = supabase.from(table).select('*')

    if (filters.search) {
      // Implement full-text search based on table structure
      const searchFields = getSearchFields(table)
      const searchConditions = searchFields.map(field => `${field}.ilike.%${filters.search}%`)
      query = query.or(searchConditions.join(','))
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error performing advanced search:', error)
    throw error
  }
}

function getSearchFields(table: string): string[] {
  switch (table) {
    case 'users':
      return ['name', 'email', 'department']
    case 'assets':
      return ['name', 'type', 'location']
    case 'incidents':
      return ['title', 'description', 'category']
    case 'requests':
      return ['title', 'description', 'type']
    default:
      return ['name', 'description']
  }
}

// Export API
export async function exportData(table: string, filters: any, format: 'csv' | 'json' = 'csv'): Promise<string> {
  try {
    const data = await advancedSearch(table, filters)
    
    if (format === 'csv') {
      return convertToCSV(data)
    } else {
      return JSON.stringify(data, null, 2)
    }
  } catch (error) {
    console.error('Error exporting data:', error)
    throw error
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
  ]
  
  return csvRows.join('\n')
}

// Individual function exports for backward compatibility
export const getAllPRs = () => prApi.getAllPRs()
export const getInventoryItems = () => assetsApi.getAll()
export const getAllUsers = () => usersApi.getAll()
export const getAllDepartments = () => departmentsApi.getAll() 