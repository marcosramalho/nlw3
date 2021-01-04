import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';

import * as Yup from 'yup';

export default {
  async index(req: Request, res:Response) {
    const orphanageRepositoty = getRepository(Orphanage);

    const orphanages = await orphanageRepositoty.find({
      relations: ['images']
    });
    return res.json(orphanageView.renderMany(orphanages));
  },

  async show(req: Request, res:Response) {
    const { id } = req.params;
    const orphanageRepositoty = getRepository(Orphanage);

    const orphanages = await orphanageRepositoty.findOneOrFail(id, {
      relations: ['images']
    });
    orphanages.open_on_weekends = orphanages.open_on_weekends as boolean;
    return res.json(orphanageView.render(orphanages));
  },

  async create(req: Request, res: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body;
    
    const orphanageRepositoty = getRepository(Orphanage);
  
    const reqImages = req.files as Express.Multer.File[];    
    const images = reqImages.map((image) => {
      return { path: image.filename }
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      latitude: Yup.number().required(),
      longitude: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });

    await schema.validate(data, {
      abortEarly: false
    });

    const orphanage = orphanageRepositoty.create(data);
  
    await orphanageRepositoty.save(orphanage);
  
    return res.status(201).json(orphanage);
  }
}