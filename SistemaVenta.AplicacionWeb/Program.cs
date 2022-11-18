//auto mapper
using SistemaVenta.AplicacionWeb.Utilidades.Automapper;
using SistemaVenta.IOC;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

//auto inyeccion de indepencias 
builder.Services.InyectarDependecia(builder.Configuration);

//auto mapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
