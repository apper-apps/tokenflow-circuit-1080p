import { createContext, useContext, useState, useEffect } from 'react';
import { workspaceService } from '@/services/api/workspaceService';
import { toast } from 'react-toastify';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWorkspaces = async () => {
    try {
      const result = await workspaceService.getAll();
      setWorkspaces(result);
      
      // Set current workspace to first active one if none set
      if (!currentWorkspace && result.length > 0) {
        const activeWorkspace = result.find(w => w.status === 'active') || result[0];
        setCurrentWorkspace(activeWorkspace);
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  const switchWorkspace = async (workspaceId) => {
    try {
      const workspace = await workspaceService.switchWorkspace(workspaceId);
      setCurrentWorkspace(workspace);
      
      // Update the workspace in the list
      setWorkspaces(prev => prev.map(w => 
        w.Id === workspaceId 
          ? workspace
          : w
      ));
      
      toast.success(`Switched to ${workspace.name}`);
      return workspace;
    } catch (error) {
      console.error('Failed to switch workspace:', error);
      toast.error('Failed to switch workspace');
      throw error;
    }
  };

  const createWorkspace = async (workspaceData) => {
    try {
      const newWorkspace = await workspaceService.create(workspaceData);
      setWorkspaces(prev => [...prev, newWorkspace]);
      toast.success('Workspace created successfully');
      return newWorkspace;
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const updateWorkspace = async (id, updateData) => {
    try {
      const updatedWorkspace = await workspaceService.update(id, updateData);
      setWorkspaces(prev => prev.map(w => 
        w.Id === id ? updatedWorkspace : w
      ));
      
      // Update current workspace if it's the one being updated
      if (currentWorkspace?.Id === id) {
        setCurrentWorkspace(updatedWorkspace);
      }
      
      toast.success('Workspace updated successfully');
      return updatedWorkspace;
    } catch (error) {
      console.error('Failed to update workspace:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const deleteWorkspace = async (id) => {
    try {
      await workspaceService.delete(id);
      
      setWorkspaces(prev => {
        const updated = prev.filter(w => w.Id !== id);
        
        // If we deleted the current workspace, switch to another one
        if (currentWorkspace?.Id === id && updated.length > 0) {
          const nextWorkspace = updated.find(w => w.status === 'active') || updated[0];
          setCurrentWorkspace(nextWorkspace);
        }
        
        return updated;
      });
      
      toast.success('Workspace deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      toast.error(error.message);
      throw error;
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const value = {
    currentWorkspace,
    workspaces,
    loading,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    refreshWorkspaces: loadWorkspaces
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};