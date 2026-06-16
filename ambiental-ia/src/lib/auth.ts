"use client";

import type { MockUser, PlanId } from "@/types";

const STORAGE_KEY = "ambiental-ia:user";

const defaultUser: MockUser = {
  name: "Usuario Ambiental",
  email: "usuario@ambientalia.com",
  company: "Ambiental IA Demo",
  plan: "intermediario",
  role: "admin"
};

export function getMockUser(): MockUser {
  if (typeof window === "undefined") {
    return defaultUser;
  }

  const storedUser = window.localStorage.getItem(STORAGE_KEY);
  if (!storedUser) {
    return defaultUser;
  }

  try {
    return JSON.parse(storedUser) as MockUser;
  } catch {
    return defaultUser;
  }
}

export function saveMockUser(user: Partial<MockUser>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...defaultUser,
      ...user,
      plan: user.plan ?? defaultUser.plan
    })
  );
}

export function updateMockPlan(plan: PlanId) {
  saveMockUser({ ...getMockUser(), plan });
}

export function clearMockUser() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
