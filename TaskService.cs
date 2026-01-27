using System.Collections.Generic;

public class TaskService
{
    private List<TaskItem> tasks = new List<TaskItem>();
    private int nextId = 1;

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

        return false;
    }
}