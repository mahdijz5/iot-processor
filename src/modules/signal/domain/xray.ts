import { NonNegativeNumber, PositiveNumber, ValidNumber } from "src/common/types";
import { z } from "zod";
 
export type Xray = Xray.Base
export namespace Xray {
    export type Base = {
      time : PositiveNumber
      speed : NonNegativeNumber
      x : ValidNumber
      y : ValidNumber
    }


    const xraySchema = z
    .object({
      time: z.number().refine(PositiveNumber.is, { message: 'Invalid time' }),
      speed: z.number().refine(NonNegativeNumber.is, { message: 'Invalid time' }),
      x: z.number().refine(ValidNumber.is, { message: 'Invalid time' }),
      y: z.number().refine(ValidNumber.is, { message: 'Invalid time' }),
     
    })
    .required();

    export const mk = (data : {
        time : number,
        speed : number,
        x : number,
        y : number
    }) : Xray => {
        const validateData = xraySchema.parse(data) as Required<
        z.infer<typeof xraySchema>
      >;
        return validateData
    }

 
     
}