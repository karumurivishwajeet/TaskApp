using System.Collections.Generic;
using System.IO;
using System.Text.Json;

public class TaskService
{
    private List<TaskItem> tasks = new List<TaskItem>();
    private int nextId = 1;
    private const string FilePath = "tasks.json";
    
    public TaskService()
    {
        LoadFromFile();
    }

    private void LoadFromFile()
    {
        if (!File.Exists(FilePath))
        {
            return;
        }

        string json = File.ReadAllText(FilePath);
        List<TaskItem> loadedTasks = JsonSerializer.Deserialize<List<TaskItem>>(json);

        if(loadedTasks != null)
        {
            tasks = loadedTasks;

            if (tasks.Count>0)
            {
                nextId = tasks[^1].Id + 1;
            }
        }
    }

    private void SaveToFile()
    {
        string json = JsonSerializer.Serialize(tasks, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        File.WriteAllText(FilePath, json);
    }
    public List<TaskItem> GetAll()
    {
        return tasks;
    }

    public TaskItem Add(string title)
    {
        TaskItem task = new TaskItem();
        task.IsCompleted = false;

        if (string.IsNullOrWhiteSpace(title))
        {
            return null;
        }
        task.Id = nextId;
        task.Title = title;

        nextId++;
        tasks.Add(task);
        SaveToFile();
        return task;
    }

    public bool Remove(int id)
    {
        TaskItem found = null;

        foreach (TaskItem task in tasks)
        {
            if (task.Id == id)
            {
                found = task;
                break;
            }
        }
        if (found == null)
        {
            return false;
        }
        tasks.Remove(found);
        SaveToFile();
        return true;
    }

    public bool ToggleComplete(int id)
    {
        foreach(TaskItem task in tasks)
        {
            if (task.Id == id)
            {
                task.IsCompleted = !task.IsCompleted;
                return true;
            }
        }
        SaveToFile();
        return false;
    }

    public bool UpdateTitle(int id, string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
        {
            return false;
        }
        foreach (TaskItem task in tasks)
        {
            if (task.Id == id)
            {
                task.Title = newTitle;
                return true;
            }
        }
        SaveToFile();
        return false;
    }
}