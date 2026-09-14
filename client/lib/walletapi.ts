const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cars24-iq0g.onrender.com/api";
const BASE_URL = `${API_BASE}/Wallet`;
const TENANT_BASE = `${API_BASE}/Tenant`;

export interface TenantConfig {
  id?: string;
  tenantId: string;
  tenantName: string;
  signupRewardReferrer: number;
  signupRewardReferee: number;
  purchaseRewardReferrer: number;
  purchaseRewardReferee: number;
  saleRewardReferrer: number;
  saleRewardReferee: number;
  pointValueInINR: number;
  maxRedemptionPercent: number;
  minRedeemPoints: number;
  description: string;
}

export interface WalletSummary {
  userId: string;
  tenantId: string;
  referralCode: string;
  referredByCode?: string;
  referralCount: number;
  successfulReferrals: number;
  currentBalance: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  equivalentInINR: number;
  tenantConfig: TenantConfig;
}

export interface WalletTransaction {
  id?: string;
  walletId: string;
  userId: string;
  tenantId: string;
  type: string;
  points: number;
  description: string;
  referenceId?: string;
  timestamp: string;
  status: string;
}

export interface RedemptionPreview {
  isValid: boolean;
  message: string;
  discountAmount: number;
  maxAllowedPoints: number;
  finalPrice: number;
}

export const getUserWallet = async (userId: string): Promise<WalletSummary> => {
  const response = await fetch(`${BASE_URL}/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch wallet summary");
  }
  return response.json();
};

export const getUserTransactions = async (userId: string): Promise<WalletTransaction[]> => {
  const response = await fetch(`${BASE_URL}/${userId}/transactions`);
  if (!response.ok) {
    return [];
  }
  return response.json();
};

export const validateReferralCode = async (referralCode: string) => {
  const response = await fetch(`${BASE_URL}/validate-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ referralCode }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Invalid referral code");
  }
  return data;
};

export const previewRedemption = async (
  userId: string,
  pointsToRedeem: number,
  itemPrice: number
): Promise<RedemptionPreview> => {
  const response = await fetch(`${BASE_URL}/preview-redemption`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, pointsToRedeem, itemPrice }),
  });
  return response.json();
};

export const getAllTenantConfigs = async (): Promise<TenantConfig[]> => {
  try {
    const response = await fetch(`${TENANT_BASE}/configs`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
};

export const getTenantConfig = async (tenantId: string): Promise<TenantConfig | null> => {
  try {
    const response = await fetch(`${TENANT_BASE}/config/${tenantId}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
};
