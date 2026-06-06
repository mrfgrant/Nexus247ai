import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user. Reflects the EFFECTIVE user (the impersonated
  // user when an admin is "viewing as" someone, otherwise the real user) so the
  // app renders that user's identity. When impersonating, it also returns an
  // `impersonating` flag and the admin's real identity so the UI can show the
  // read-only banner and exit control.
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const realUserId = req.realUserId ?? req.user.claims.sub;
      const effectiveUserId = req.effectiveUserId ?? realUserId;
      const user = await authStorage.getUser(effectiveUserId);

      if (req.isImpersonating) {
        const realUser = await authStorage.getUser(realUserId);
        return res.json({
          ...user,
          impersonating: true,
          realUser: realUser
            ? {
                id: realUser.id,
                firstName: realUser.firstName,
                lastName: realUser.lastName,
                email: realUser.email,
              }
            : { id: realUserId },
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
