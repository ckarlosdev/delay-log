export type Job = {
  jobsId: number | null;
  number: string;
  type: string;
  name: string;
  address: string;
  contractor: string;
  contact: string;
  status: string;
};

export type Employee = {
  employeesId: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  title: string;
};

export type DelayLog = {
  id: number | null;
  jobId: number | null;
  employeeId: number | null;
  delayDate: string;
  location: string;
  delayDescription: string;
  impactEquipment: string;
  summary: string;
  resolution: string;
  workers: string;
  cost: string;
  delayStatus: string;
  times: DelayTime[];
  options: DelayOption[];
  signatures: DelaySignature[];
};

export type DelayTime = {
  id: number | null;
  logDate: string;
  startTime: string;
  endTime: string | null;
};

export type DelayOption = {
  id: number | null;
  optionItemId: number;
  other: string | null;
};

export type DelaySignature = {
  id: number;
  signatureRole: string;
  company: string;
  filePath: string;
};

export type OptionItem = {
  id: number;
  optionType: String;
  optionName: String;
};

export type User = {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];
};

export type Role = {
  id: number;
  name: string;
};

export type ModalConfiguration = {
  title: string;
  body: string;
  variant: string;
};

export type Signature = {
  id: number;
  signatureRole: string;
  filePath: string;
};