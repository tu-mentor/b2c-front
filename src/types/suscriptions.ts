enum SubscriptionStatus {
  PENDING = "0",
  ACTIVE = "1",
  CANCELLED = "2",
  EXPIRED = "3",
}

enum SubscriptionType {
  BTC = "0",
  BTB = "1",
}

interface Subscription {
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  subscriptionType: SubscriptionType;
  remainingDays: number;
  moduleId: string;
}

export interface ChildSubscription {
  childId: string;
  subscriptions: Subscription[];
}

export interface CompanySuscriptionResponse {
  success: boolean;
  message: string;
}

