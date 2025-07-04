
export interface UserInfo {
  name: string;
  id: string;
  username: string;
  mobile: string;
  accountStatus: string;
  connectionStatus: string;
  expiryDate: string;
  package: string;
  planRate: string;
}

export interface PaymentHistory {
  payDate: string;
  billAmount: string;
  receivedAmount: string;
  remarks: string;
}

export interface UsageHistory {
  connectionDate: string;
  disconnectionDate: string;
  upload: string;
  download: string;
  sessionTime: string;
}

export interface UserData {
  userInfo: UserInfo;
  paymentHistory: PaymentHistory[];
  usageHistory: UsageHistory[];
}

export interface ProcessedSession {
  startDate: Date;
  endDate: Date | null;
  uploadMB: number;
  downloadMB: number;
  totalMB: number;
  durationSeconds: number;
  tags: string[];
}