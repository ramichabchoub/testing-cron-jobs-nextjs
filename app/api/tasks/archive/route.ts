import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST() {
  try {
    // Archive tasks completed more than 24 hours ago
    const archivedCount = await convex.mutation(api.tasks.archiveCompletedTasks, {
      olderThanHours: 24
    });

    return NextResponse.json({ 
      success: true, 
      message: `Archived ${archivedCount} tasks` 
    });
  } catch (error) {
    console.error("Error archiving tasks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to archive tasks" },
      { status: 500 }
    );
  }
} 