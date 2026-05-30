import type { DashboardStats, ActivityItem, Resolution } from './dashboardService';
import type { User, UserListResponse } from './userService';
import type { ChatMessageResponse, ChatSuggestion } from './chatService';

export const MOCK_STATS: DashboardStats = {
  total_resolutions: 142,
  resolutions_this_month: 18,
  most_used_tags: ['firmware', 'hardware', 'network', 'power', 'display'],
  open_issues: 7,
};

export const MOCK_RESOLUTIONS: Resolution[] = [
  {
    id: 'res-001',
    title: 'MCU boot failure after firmware v3.2.1 flash',
    severity: 'CRITICAL',
    tags: ['firmware', 'MCU', 'boot'],
    hardware_reference: 'HW-REV-4B',
    firmware_version: 'v3.2.1',
    created_by: { id: 'usr-1', name: 'Arjun Mehta', email: 'arjun@chinmayfinlease.com' },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-002',
    title: 'I2C bus lockup on temperature sensor polling',
    severity: 'HIGH',
    tags: ['hardware', 'I2C', 'sensor'],
    hardware_reference: 'HW-REV-3A',
    firmware_version: 'v3.1.8',
    created_by: { id: 'usr-2', name: 'Priya Sharma', email: 'priya@chinmayfinlease.com' },
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-003',
    title: 'MQTT reconnect loop under poor network conditions',
    severity: 'HIGH',
    tags: ['network', 'MQTT', 'connectivity'],
    hardware_reference: 'HW-REV-4A',
    firmware_version: 'v3.2.0',
    created_by: { id: 'usr-3', name: 'Rahul Nair', email: 'rahul@chinmayfinlease.com' },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-004',
    title: 'Display flicker at low brightness in dark mode',
    severity: 'MEDIUM',
    tags: ['display', 'UI', 'power'],
    hardware_reference: 'HW-REV-2C',
    firmware_version: 'v2.9.5',
    created_by: { id: 'usr-1', name: 'Arjun Mehta', email: 'arjun@chinmayfinlease.com' },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-005',
    title: 'OTA update stalls at 97% on slow connections',
    severity: 'MEDIUM',
    tags: ['firmware', 'OTA', 'network'],
    hardware_reference: 'HW-REV-4B',
    firmware_version: 'v3.1.9',
    created_by: { id: 'usr-4', name: 'Sneha Patel', email: 'sneha@chinmayfinlease.com' },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-006',
    title: 'BLE pairing fails with Android 14 devices',
    severity: 'HIGH',
    tags: ['BLE', 'connectivity', 'hardware'],
    hardware_reference: 'HW-REV-4A',
    firmware_version: 'v3.2.0',
    created_by: { id: 'usr-2', name: 'Priya Sharma', email: 'priya@chinmayfinlease.com' },
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-007',
    title: 'Power rail instability under 3A continuous load',
    severity: 'CRITICAL',
    tags: ['power', 'hardware', 'stability'],
    hardware_reference: 'HW-REV-3B',
    firmware_version: 'v3.0.4',
    created_by: { id: 'usr-3', name: 'Rahul Nair', email: 'rahul@chinmayfinlease.com' },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'res-008',
    title: 'Watchdog timer reset on deep sleep exit',
    severity: 'LOW',
    tags: ['firmware', 'power', 'sleep'],
    hardware_reference: 'HW-REV-4B',
    firmware_version: 'v3.2.1',
    created_by: { id: 'usr-4', name: 'Sneha Patel', email: 'sneha@chinmayfinlease.com' },
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-001',
    user_id: 'usr-1',
    user_name: 'Arjun Mehta',
    user_email: 'arjun@chinmayfinlease.com',
    action: 'resolved',
    resolution_id: 'res-001',
    resolution_title: 'MCU boot failure after firmware v3.2.1 flash',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-002',
    user_id: 'usr-2',
    user_name: 'Priya Sharma',
    user_email: 'priya@chinmayfinlease.com',
    action: 'added',
    resolution_id: 'res-002',
    resolution_title: 'I2C bus lockup on temperature sensor polling',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-003',
    user_id: 'usr-3',
    user_name: 'Rahul Nair',
    user_email: 'rahul@chinmayfinlease.com',
    action: 'updated',
    resolution_id: 'res-003',
    resolution_title: 'MQTT reconnect loop under poor network conditions',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-004',
    user_id: 'usr-4',
    user_name: 'Sneha Patel',
    user_email: 'sneha@chinmayfinlease.com',
    action: 'reviewed',
    resolution_id: 'res-005',
    resolution_title: 'OTA update stalls at 97% on slow connections',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-005',
    user_id: 'usr-1',
    user_name: 'Arjun Mehta',
    user_email: 'arjun@chinmayfinlease.com',
    action: 'added',
    resolution_id: 'res-004',
    resolution_title: 'Display flicker at low brightness in dark mode',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Arjun Mehta',
    email: 'arjun@chinmayfinlease.com',
    role: 'Super Admin',
    status: 'active',
    date_joined: '2024-01-15T09:00:00Z',
    last_active: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    email: 'priya@chinmayfinlease.com',
    role: 'Engineer',
    status: 'active',
    date_joined: '2024-02-10T10:30:00Z',
    last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-3',
    name: 'Rahul Nair',
    email: 'rahul@chinmayfinlease.com',
    role: 'Engineer',
    status: 'active',
    date_joined: '2024-03-05T08:00:00Z',
    last_active: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-4',
    name: 'Sneha Patel',
    email: 'sneha@chinmayfinlease.com',
    role: 'Engineer',
    status: 'active',
    date_joined: '2024-03-20T11:00:00Z',
    last_active: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-5',
    name: 'Vikram Reddy',
    email: 'vikram@chinmayfinlease.com',
    role: 'Super Admin',
    status: 'active',
    date_joined: '2024-01-10T09:00:00Z',
    last_active: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-6',
    name: 'Ananya Iyer',
    email: 'ananya@chinmayfinlease.com',
    role: 'Engineer',
    status: 'inactive',
    date_joined: '2024-04-01T10:00:00Z',
    last_active: '2024-11-20T15:00:00Z',
  },
  {
    id: 'usr-7',
    name: 'Kiran Desai',
    email: 'kiran@chinmayfinlease.com',
    role: 'Engineer',
    status: 'active',
    date_joined: '2024-05-15T09:30:00Z',
    last_active: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_USER_LIST: UserListResponse = {
  data: MOCK_USERS,
  total: MOCK_USERS.length,
  page: 1,
  limit: 50,
  totalPages: 1,
};

export const MOCK_SUGGESTIONS: ChatSuggestion[] = [
  { id: 'sug-1', question: 'What causes MCU boot failures after firmware updates?' },
  { id: 'sug-2', question: 'How do I debug I2C bus lockups on sensor polling?' },
  { id: 'sug-3', question: 'What are common causes of BLE pairing failures with Android?' },
  { id: 'sug-4', question: 'How can I resolve OTA update stalls at high percentages?' },
];

const MOCK_RESPONSES: ChatMessageResponse[] = [
  {
    message_id: 'msg-001',
    response:
      'MCU boot failures after firmware flashing are commonly caused by a corrupted bootloader, mismatched memory map, or incorrect linker script settings. First, verify the flash process completed without CRC errors. Then check that the new firmware\'s vector table address matches your bootloader\'s expected application start address.\n\nIf using a dual-bank flash setup, confirm the bank swap completed correctly. A logic analyzer on the UART boot pins can confirm whether the MCU is entering bootloader mode unexpectedly.',
    sources: [
      { id: 'res-001', title: 'MCU boot failure after firmware v3.2.1 flash', excerpt: 'Root cause identified as misaligned vector table offset in linker script. Fixed by updating FLASH_APP_START to 0x08010000 in linker.ld.' },
      { id: 'res-007', title: 'Power rail instability under 3A continuous load', excerpt: 'Unstable 3.3V rail during MCU boot sequence caused intermittent reset loops. Resolved by adding 100µF bulk capacitance near the MCU VDD pins.' },
    ],
  },
  {
    message_id: 'msg-002',
    response:
      'I2C bus lockups during sensor polling typically occur due to clock stretching timeouts, electrical noise, or a sensor holding SDA low. The standard recovery procedure is to manually clock SCL 9 times to release the stuck SDA line, then issue a STOP condition.\n\nIn firmware, implement a watchdog on the I2C peripheral: if a transaction exceeds your expected timeout, reset the I2C peripheral using HAL_I2C_DeInit() followed by HAL_I2C_Init(). Also verify pull-up resistor values — for 400 kHz fast mode, 2.2 kΩ is typically optimal.',
    sources: [
      { id: 'res-002', title: 'I2C bus lockup on temperature sensor polling', excerpt: 'Sensor held SDA low after power glitch. Added 9-clock recovery routine and reduced I2C frequency from 400kHz to 100kHz for improved reliability.' },
    ],
  },
];

let mockResponseIndex = 0;

export function getMockChatResponse(message: string): ChatMessageResponse {
  const response = MOCK_RESPONSES[mockResponseIndex % MOCK_RESPONSES.length];
  mockResponseIndex++;
  return { ...response, message_id: `msg-${Date.now()}` };
}
