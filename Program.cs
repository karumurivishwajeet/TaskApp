using System.ComponentModel;
using System.Diagnostics.Tracing;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using Microsoft.VisualBasic;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

TaskService service = new TaskService();

app.MapGet("/tasks", () =>
{
    //throw new Exception("Test error");
    return Results.Ok(service.GetAll());
});

app.MapPost("/tasks", (TaskItem task) =>
{
    TaskItem created = service.Add(task.Title);
    if (created == null)
    {
        return Results.BadRequest("Task title cannot be empty");
    }
    return Results.Created($"/tasks/{created.Id}", created);
});

app.MapDelete("/tasks/{id}", (int id) =>
{
    bool removed = service.Remove(id);

    if (!removed)
    {
        return Results.NotFound("Task not found");
    }

    return Results.Ok();
});

app.MapPut("/tasks/{id}/toggle", (int id) =>
{
    bool updated = service.ToggleComplete(id);

    if (!updated)
    {
        return Results.NotFound("Task not found");
    }
    return Results.Ok();
});

app.MapPut("/tasks/{id}", (int id, TaskItem task) =>
{
    bool updated = service.UpdateTitle(id, task.Title);

    if (!updated)
    {
        return Results.BadRequest("Invalid task or title");
    }
    return Results.Ok();
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseExceptionHandler(errorApp =>
{
   errorApp.Run(async context =>
   {
       context.Response.StatusCode = 500;
       context.Response.ContentType = "application/json";

       await context.Response.WriteAsync(
        "{\"error\": \"An unexpected error occurred.\"}"
       );
   }); 
});

app.Use(async (context, next) =>
{
   try
   {
    await next();
   }
   catch (Exception ex)
   {
    Console.WriteLine(ex.Message);
    throw;
   } 
});

app.Run();

// List<TaskItem> GetTasks()
// {
//     return service.GetAll();
// }

// IResult AddTask(TaskItem task)
// {
//     TaskItem created = service.Add(task.Title);

//     if (created == null)
//     {
//         return Results.BadRequest();
//     }
    
//     return Results.Ok(created);
// }

// IResult DeleteTask(int id)
// {
//     bool removed = service.Remove(id);

//     if (!removed)
//     {
//         return Results.NotFound();
//     }
    
//     return Results.Ok();
// }

// IResult ToggleTask(int id)
// {
//     bool updated = service.ToggleComplete(id);

//     if (!updated)
//     {
//         return Results.NotFound();
//     }

//     return Results.Ok();
// }

// IResult UpdateTask(int id, TaskItem task)
// {
//     bool updated = service.UpdateTitle(id, task.Title);

//     if (!updated)
//     {
//         return Results.BadRequest();
//     }

//     return Results.Ok();
// }