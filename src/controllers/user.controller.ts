import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { checkPassword, hashPassword } from "../utils/auth";
import slug from "slug";
import { createAccessToken } from "../utils/jwt";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from "uuid";
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, handle: handleInput } = req.body;

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Usuario ya existe" });
    }

    const handle = slug(handleInput, "");
    const handleExists = await UserModel.findOne({ handle });
    if (handleExists) {
      return res.status(409).json({ message: "El handle ya está en uso" });
    }

    const hashedPassword = await hashPassword(password);

    await UserModel.create({
      handle,
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userFound = await UserModel.findOne({ email }).lean();
    if (!userFound)
      return res.status(401).json({ message: "Credenciales inválidas 😫" });

    const isPasswordValid = await checkPassword(password, userFound.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Credenciales inválidas 😫" });

    const token = createAccessToken({ id: userFound._id });

    res.status(200).json({
      message: "Usuario logeado exitosamente",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al logear usuario", error });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Perfil obtenido correctamente",
    user: req.user,
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { handle: handleInput, description } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }
    const handle = slug(handleInput, "");
    const handleExists = await UserModel.findOne({ handle });
    if (handleExists && handleExists.email !== req.user.email) {
      return res.status(409).json({ message: "El handle no esta disponible" });
    }

    req.user.description = description;
    req.user.handle = handle;
    await req.user.save();

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el perfil", error });
  }
};

export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error al procesar la imagen", error: err });
      }

      // Asegurar que el archivo exista
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file || !file.filepath) {
        return res
          .status(400)
          .json({ message: "No se encontró el archivo de imagen" });
      }

      cloudinary.uploader.upload(
        file.filepath,
        { public_id: uuid() },
        async (error, result) => {
          if (error)
            return res
              .status(500)
              .json({ message: "Error al subir la imagen", error });
          if (!req.user) {
            return res.status(401).json({ message: "No autorizado" });
          }
          if (result) {
            (req.user.image = result.secure_url), await req.user.save();
            return res.status(200).json({
              message: "Imagen de perfil actualizada correctamente",
              imageUrl: result.secure_url,
            });
          }
        }
      );
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar la imagen de perfil", error });
  }
};
