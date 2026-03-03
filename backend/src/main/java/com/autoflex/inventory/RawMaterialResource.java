package com.autoflex.inventory;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> listAll() {
        return RawMaterial.listAll();
    }

    @POST
    @Transactional
    public Response create(RawMaterial rawMaterial) {
        if (rawMaterial.id != null) {
            throw new WebApplicationException("Id was invalidly set on request.", 422);
        }
        // Validação de estoque negativo (Critério de aceite da Issue 3)
        if (rawMaterial.stockQuantity != null && rawMaterial.stockQuantity < 0) {
            throw new WebApplicationException("Stock quantity cannot be negative.", 400);
        }
        rawMaterial.persist();
        return Response.status(Response.Status.CREATED).entity(rawMaterial).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public RawMaterial update(@PathParam("id") Long id, RawMaterial updatedRawMaterial) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Raw Material with id of " + id + " does not exist.", 404);
        }
        if (updatedRawMaterial.stockQuantity != null && updatedRawMaterial.stockQuantity < 0) {
            throw new WebApplicationException("Stock quantity cannot be negative.", 400);
        }
        entity.code = updatedRawMaterial.code;
        entity.name = updatedRawMaterial.name;
        entity.stockQuantity = updatedRawMaterial.stockQuantity;
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Raw Material with id of " + id + " does not exist.", 404);
        }
        entity.delete();
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}