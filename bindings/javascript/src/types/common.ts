import { DwgPoint2D, DwgPoint3D } from '../database'

export type Dwg_Array_Ptr = number
export type Dwg_Data_Ptr = number
export type Dwg_Object_Ptr = number
export type Dwg_Object_Ref_Ptr = number
export type Dwg_Object_Object_Ptr = number
export type Dwg_Object_Entity_Ptr = number

export interface Dwg_Handle {
  code: number
  size: number
  value: number
  is_global: number
}

export interface Dwg_Object_Ref {
  obj: Dwg_Object_Ptr
  handleref: Dwg_Handle
  absolute_ref: number
  r11_idx: number
}

export interface Dwg_Color {
  index: number
  flag: number
  rgb: number
  name: string
  book_name: string
}

export interface Dwg_LTYPE_Dash {
  length: number
  complex_shapecode: number
  style: number
  x_offset: number
  y_offset: number
  scale: number
  rotation: number
  shape_flag: number
  text: string
}

export interface Dwg_Field_Value {
  success: boolean
  message?: string
  data?: string | number | Dwg_Color | Dwg_Array_Ptr | DwgPoint2D | DwgPoint3D
}
