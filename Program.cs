using System.ComponentModel;
using System.Diagnostics.Tracing;
using System.Runtime.CompilerServices;
using Microsoft.VisualBasic;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

TaskService service = new TaskService();

app.MapGet("/tasks", GetTasks);
app.MapPost("/tasks", AddTask);
app.MapDelete("/tasks/{id}", DeleteTask);
app.MapPut("tasks/{id}/toggle", ToggleTask);
app.MapPut("tasks/{id}", UpdateTask);

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();

List<TaskItem> GetTasks()
{
    return service.GetAll();
}

IResult AddTask(TaskItem task)
{
    TaskItem created = service.Add(task.Title);

    if (created == null)
    {
        return Results.BadRequest();
    }
    
    return Results.Ok(created);
}

IResult DeleteTask(int id)
{
    bool removed = service.Remove(id);

    if (!removed)
    {
        return Results.NotFound();
    }
    
    return Results.Ok();
}

IResult ToggleTask(int id)
{
    bool updated = service.ToggleComplete(id);

    if (!updated)
    {
        return Results.NotFound();
    }

    return Results.Ok();
}

IResult UpdateTask(int id, TaskItem task)
{
    bool updated = service.UpdateTitle(id, task.Title);

    if (!updated)
    {
        return Results.BadRequest();
    }

    return Results.Ok();
}