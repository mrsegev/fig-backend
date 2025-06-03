import { Router } from 'express';
import {
  getIntegrations,
  getIntegrationById,
  createIntegration,
  updateIntegration,
  deleteIntegration
} from '../services/integrations/integrationsService';
import { Integration } from '../services/integrations/types/Integration';

const router = Router();

// Get all integrations
router.get('/', async (req, res) => {
  try {
    const { data, error } = await getIntegrations();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

// Get integration by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await getIntegrationById(req.params.id);
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch integration' });
  }
});

// Create new integration
router.post('/', async (req, res) => {
  try {
    const integration: Integration = req.body;
    const createdIntegration = await createIntegration(integration);
    res.status(201).json(createdIntegration);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create integration' });
  }
});

// Update integration
router.patch('/:id', async (req, res) => {
  try {
    const integration = await updateIntegration(req.params.id, req.body);
    res.json(integration);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update integration' });
  }
});

// Delete integration
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await deleteIntegration(req.params.id);
    if (error) throw error;    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete integration' });
  }
});

export default router; 