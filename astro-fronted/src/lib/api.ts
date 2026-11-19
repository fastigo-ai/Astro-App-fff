import { API_BASE_URL } from './constants';

export interface AdminUser {
  id?: string;
  phone: string;
  name?: string;
  role: 'user' | 'admin' | 'super_admin';
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('astrobaby_admin_token');
    }
    return null;
  }

  private setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('astrobaby_admin_token', token);
    }
  }

  public clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('astrobaby_admin_token');
      localStorage.removeItem('astrobaby_admin_user');
    }
  }

  public getStoredUser(): AdminUser | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('astrobaby_admin_user');
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  public setStoredUser(user: AdminUser) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('astrobaby_admin_user', JSON.stringify(user));
    }
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json.error || json.message || `Request failed with status ${response.status}`);
      }

      return json;
    } catch (err: any) {
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
      throw err;
    }
  }

  // ==========================
  // 1. Auth & Admin OTP
  // ==========================
  async sendOtp(phone: string) {
    return this.request<{ success: boolean; devOtp?: string; message?: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(phone: string, otp: string) {
    const res = await this.request<{
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
        user: { id: string; phone: string; name?: string; role: 'user' | 'admin' | 'super_admin' };
      };
    }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });

    if (res?.data?.accessToken) {
      this.setToken(res.data.accessToken);
      this.setStoredUser(res.data.user);
    }
    return res;
  }

  // ==========================
  // 2. Dashboard Stats & Users
  // ==========================
  async getStats() {
    return this.request<{ success: boolean; data: Record<string, any> }>('/admin/stats');
  }

  async getUsers() {
    return this.request<{ success: boolean; count: number; data: any[] }>('/admin/users');
  }

  async assignRole(phone: string, role: 'user' | 'admin' | 'super_admin') {
    return this.request('/admin/roles/assign', {
      method: 'POST',
      body: JSON.stringify({ phone, role }),
    });
  }

  async grantUser(data: { phone: string; programId: string; tierName?: string; durationMonths?: number }) {
    return this.request('/admin/users/grant', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async revokeUser(phone: string) {
    return this.request('/admin/users/revoke', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  // ==========================
  // 3. Courses & Lessons (LMS)
  // ==========================
  async listCourses() {
    return this.request<{ success: boolean; data: any[] }>('/courses');
  }

  async listCourseLessons(courseId: string) {
    return this.request<{ success: boolean; data: any[] }>(`/admin/courses/${courseId}/lessons`);
  }

  async createLesson(courseId: string, data: any) {
    return this.request(`/admin/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLesson(courseId: string, lessonId: string, data: any) {
    return this.request(`/admin/courses/${courseId}/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLesson(courseId: string, lessonId: string) {
    return this.request(`/admin/courses/${courseId}/lessons/${lessonId}`, {
      method: 'DELETE',
    });
  }

  async createCourse(data: any) {
    return this.request('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(id: string, data: any) {
    return this.request(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // ==========================
  // 4. Daily Activities & Care Notes
  // ==========================
  async getDailySchedule(month: number, day: number) {
    return this.request<{ success: boolean; data: any }>(`/admin/activities/daily?month=${month}&day=${day}`);
  }

  async saveDailySchedule(data: any) {
    return this.request('/admin/activities/daily', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCareNotes(month: number, day: number) {
    return this.request<{ success: boolean; data: any }>(`/admin/care-notes?month=${month}&day=${day}`);
  }

  async saveCareNotes(data: any) {
    return this.request('/admin/care-notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==========================
  // 5. Live Zoom Classes & Webinars
  // ==========================
  async listClasses() {
    return this.request<{ success: boolean; data: any[] }>('/admin/classes');
  }

  async createClass(data: {
    title: string;
    subtitle?: string;
    description?: string;
    mentorName: string;
    mentorRole?: string;
    startTime: string;
    durationMinutes: number;
    meetingUrl: string;
    programId?: string;
    category?: string;
    maxAttendees?: number;
    coverImageUrl?: string;
  }) {
    return this.request('/admin/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async publishRecording(classId: string, data: { videoUrl: string; durationMinutes?: number }) {
    return this.request(`/admin/classes/${classId}/publish-recording`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteClass(classId: string) {
    return this.request(`/admin/classes/${classId}`, {
      method: 'DELETE',
    });
  }

  // ==========================
  // 5. Recorded Masterclasses & Daily Videos
  // ==========================
  async listRecorded() {
    return this.request<{ success: boolean; data: any[] }>('/admin/recorded');
  }

  async createRecorded(data: {
    title: string;
    description: string;
    videoUrl: string;
    durationMinutes: number;
    mentorName: string;
    mentorRole?: string;
    category?: string;
    programId?: string;
    thumbnailUrl?: string;
  }) {
    return this.request('/admin/recorded', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteRecorded(id: string) {
    return this.request(`/admin/recorded/${id}`, {
      method: 'DELETE',
    });
  }

  // ==========================
  // 6. Support Tickets
  // ==========================
  async listTickets() {
    return this.request<{ success: boolean; data: any[] }>('/admin/support/tickets');
  }

  async replyTicket(ticketId: string, message: string) {
    return this.request(`/admin/support/tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async updateTicketStatus(ticketId: string, status: string) {
    return this.request(`/admin/support/tickets/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

export const api = new ApiClient();
