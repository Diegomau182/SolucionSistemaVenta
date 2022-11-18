using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SistemaVenta.DAL.DBContext;
using Microsoft.EntityFrameworkCore;
using SistemaVenta.DAL.Interfaces;
using SistemaVenta.DAL.Implementacion;
using SistemaVenta.BLL.Interfaces;
using SistemaVenta.BLL.Implementacion;

namespace SistemaVenta.IOC
{
    public static class Dependencia
    {

        public static void InyectarDependecia(this IServiceCollection services, IConfiguration Configuration)
        {
            services.AddDbContext<DbventaContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("CadenaSQL"));
            });

            //Servcio de venta y los  genericos
            services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IVentaRepository, VentaRepository>();


            //Agregar el servicio de correo 
            services.AddScoped<ICorreoService, CorreoService>();

            // Agregar el servicio de subir y bajar de firebase (Imagenes)
            services.AddScoped<IFirebaseService, FirebaseService>();

            // Agregar el servicio de encriptacion de contraseña
            services.AddScoped<IUtilidadesService, UtilidadesService>();

            // Agregar el servicio de Roles
            services.AddScoped<IRolService, RolService>();

            // agregar el servicio de usuario
            services.AddScoped<IUsuarioService, UsuarioService>();

            // agregar el servicio de Negocios
            services.AddScoped<INegocioService, NegocioService>();

        }
    }
}
