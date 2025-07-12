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
  DepartmentIntegration 
} from './supabase'

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