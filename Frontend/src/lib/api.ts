// Centralized API utility for NORA AI backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// --- API Utility (apiFetch) ---
export async function apiFetch(path: string, options: RequestInit = {}) {
  const rawHeaders = options.headers;
  let headers: Record<string, string> = {};

  if (rawHeaders instanceof Headers) {
    headers = Object.fromEntries(rawHeaders.entries());
  } else if (typeof rawHeaders === 'object' && rawHeaders !== null) {
    headers = { ...rawHeaders } as Record<string, string>;
  }

  headers['Accept'] = 'application/json';
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  } else {
    delete headers['Content-Type'];
  }
  Object.keys(headers).forEach((key) => headers[key] === undefined && delete headers[key]);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
    });
    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorData = JSON.parse(errorText);
        let errorMessage = '';
        if (typeof errorData.message === 'object') {
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.map(msg => msg.message || msg).join(', ');
          } else {
            errorMessage = errorData.message.message || JSON.stringify(errorData.message);
          }
        } else {
          errorMessage = errorData.message || errorData.error || 'Request failed';
        }
        throw new Error(errorMessage);
      } catch (e) {
        throw new Error(errorText || 'Request failed');
      }
    }
    return res.json();
  } catch (error) {
    console.error(`API Error (${path}):`, error);
    throw error;
  }
}

// --- RESUME ---
export async function uploadResume(file: File): Promise<{ id: string; text: string }> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch("/api/v1/resume/upload", {
    method: "POST",
    body: formData,
  });
}

// --- JOB DESCRIPTION ---
export async function uploadJobDescription(file: File): Promise<{ id: string; text: string }> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch("/api/v1/jd/upload", {
    method: "POST",
    body: formData,
  });
}

// --- INTERVIEW ---
export async function startInterview(resumeText: string, jobDescription: string) {
  return apiFetch("/api/v1/interview/start", {
    method: "POST",
    body: JSON.stringify({ resumeText, jobDescription }),
  });
}

export async function submitInterviewAnswer(interviewContext: any, answer: string) {
  return apiFetch("/api/v1/interview/answer", {
    method: "POST",
    body: JSON.stringify({ interviewContext, answer }),
  });
}

export async function finishInterview(interviewContext: any) {
  return apiFetch("/api/v1/interview/finish", {
    method: "POST",
    body: JSON.stringify({ interviewContext }),
  });
}

// --- AI ---
export async function generateAIQuestion(dto: any) {
  return apiFetch("/api/v1/ai/question", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function generateAIFeedback(dto: any) {
  return apiFetch("/api/v1/ai/feedback", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function analyzeTranscript(transcript: string) {
  return apiFetch("/api/v1/ai/analyze", {
    method: "POST",
    body: JSON.stringify({ transcript }),
  });
}
