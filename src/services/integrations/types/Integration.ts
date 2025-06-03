export type Integration = {
  id: string;
  name: string;  
  type: "webhook" | "schedule" | "event"
  enabled: boolean;
  configuration: WebhookIntegrationConfig | ScheduleIntegrationConfig | EventIntegrationConfig;
  created_at: string;  
};

export type WebhookIntegrationConfig = {
  target_url: string;
}

export type ScheduleIntegrationConfig = {
  cron_expression: string;
}

export type EventIntegrationConfig = {
  action_id: string;
}