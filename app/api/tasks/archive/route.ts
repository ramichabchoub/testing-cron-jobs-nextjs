import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST() {
  try {
    const archivedCount = await convex.mutation(api.tasks.archiveCompletedTasks, {
      olderThanHours: 24
    });
    
    console.log(`Cron job: Archived ${archivedCount} tasks`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Archived ${archivedCount} tasks`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to archive tasks",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 