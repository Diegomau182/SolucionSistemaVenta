﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.BLL.Interfaces;
using SistemaVenta.DAL.Interfaces;
using SistemaVenta.Entity;

namespace SistemaVenta.BLL.Implementacion
{
    public class CategoriaService : ICategoriaService
    {
        private readonly IGenericRepository<Categoria> _repositorio;

        public CategoriaService(IGenericRepository<Categoria> repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<List<Categoria>> Lista()
        {
            IQueryable<Categoria> query = await _repositorio.Consultar();
            return query.ToList();
        }
        public async Task<Categoria> Crear(Categoria entidad)
        {
            try
            {
                Categoria categoria_creada = await _repositorio.Crear(entidad);
                if (categoria_creada.IdCategoria == 0)
                    throw new TaskCanceledException("No se pudo crear la categoria");

                return categoria_creada;
            }
            catch 
            {

                throw;
            }
        }

        public async Task<Categoria> Editar(Categoria entidad)
        {
            try
            {
                Categoria categoria_encontrado = await _repositorio.Obtener(c => c.IdCategoria == entidad.IdCategoria);
                categoria_encontrado.Descripcion = entidad.Descripcion;
                categoria_encontrado.EsActivo = entidad.EsActivo;

                bool respuesta = await _repositorio.Editar(categoria_encontrado);
                if (!respuesta)
                    throw new TaskCanceledException("No se pudo Editar la categoria");

                return (categoria_encontrado);
            }
            catch
            {

                throw;
            }
        }

        public async Task<bool> Eliminar(int idCategoria)
        {
            try
            {
                Categoria categoria_encontrada = await _repositorio.Obtener(c => c.IdCategoria == idCategoria);

                if (categoria_encontrada == null)
                    throw new TaskCanceledException("No se encontro la categoria");

                bool respuesta = await _repositorio.Eliminar(categoria_encontrada);

                return respuesta;
            }
            catch
            {
                return false;
            }
        }

        
    }
}