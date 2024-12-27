"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const addTask = useMutation(api.tasks.add);
  const deleteTask = useMutation(api.tasks.remove);
  const toggleTask = useMutation(api.tasks.toggleComplete);
  const archiveTasks = useMutation(api.tasks.archiveCompletedTasks);
  const [newTaskText, setNewTaskText] = useState("");
  const [archiveMessage, setArchiveMessage] = useState<string>("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    await addTask({ text: newTaskText });
    setNewTaskText("");
  };

  const handleManualArchive = async () => {
    try {
      const archivedCount = await archiveTasks({ olderThanHours: 24 });
      setArchiveMessage(`Successfully archived ${archivedCount} completed tasks`);
      
      setTimeout(() => {
        setArchiveMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error archiving tasks:", error);
      setArchiveMessage("Failed to archive tasks");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-md">
        <form onSubmit={handleAddTask} className="mb-8 flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded border p-2"
          />
          <button 
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add
          </button>
        </form>

        <div className="mb-4 flex flex-col gap-2">
          <button
            onClick={handleManualArchive}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Archive Old Tasks
          </button>
          {archiveMessage && (
            <div className="text-sm text-green-600">
              {archiveMessage}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {tasks?.filter(task => !task.isArchived).map((task) => (
            <div 
              key={task._id} 
              className="flex items-center justify-between rounded border p-4"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={(e) => toggleTask({ 
                    id: task._id, 
                    isCompleted: e.target.checked 
                  })}
                  className="h-4 w-4"
                />
                <span className={task.isCompleted ? "line-through" : ""}>
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask({ id: task._id })}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
