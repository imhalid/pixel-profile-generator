import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PreviewState {
  rotation: number
  firstColor: string
  firstColorPosition: number
  firstColorOpacity: string
  secondColor: string
  secondColorPosition: number
  secondColorOpacity: string
  textColor: string
  textColorOpacity: string
  userName: string
  imageUrl: string
  gradientType?: 'linear' | 'radial'
  gradientColor: string
}

const initialState: PreviewState = {
  rotation: 0,
  firstColor: '#165a4c',
  firstColorPosition: 0,
  firstColorOpacity: 'FF',
  secondColor: '#91db69',
  secondColorPosition: 100,
  secondColorOpacity: 'FF',
  textColor: '#ffffff',
  textColorOpacity: 'FF',
  userName: 'imhalid',
  imageUrl: '',
  gradientType: 'radial',
  gradientColor: 'radial-gradient(circle at 66% 34%, #3ddb82 0%, #1c1c45 100%)'
}

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setRotation: (state, action: PayloadAction<number>) => {
      state.rotation = action.payload
    },
    setFirstColor: (state, action: PayloadAction<string>) => {
      state.firstColor = action.payload
    },
    setFirstColorPosition: (state, action: PayloadAction<number>) => {
      state.firstColorPosition = action.payload
    },
    setFirstColorOpacity: (state, action: PayloadAction<string>) => {
      state.firstColorOpacity = action.payload
    },
    setSecondColor: (state, action: PayloadAction<string>) => {
      state.secondColor = action.payload
    },
    setSecondColorPosition: (state, action: PayloadAction<number>) => {
      state.secondColorPosition = action.payload
    },
    setSecondColorOpacity: (state, action: PayloadAction<string>) => {
      state.secondColorOpacity = action.payload
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload
    },
    setTextColor: (state, action: PayloadAction<string>) => {
      state.textColor = action.payload
    },
    setTextColorOpacity: (state, action: PayloadAction<string>) => {
      state.textColorOpacity = action.payload
    },
    setImageUrl: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload
    },
    setGradientType: (state, action: PayloadAction<'linear' | 'radial'>) => {
      state.gradientType = action.payload
    },
    setGradnentColor: (state, action: PayloadAction<string>) => {
      state.gradientColor = action.payload
    }
  },
})

export const {
  setRotation,
  setFirstColor,
  setFirstColorPosition,
  setFirstColorOpacity,
  setSecondColor,
  setSecondColorPosition,
  setSecondColorOpacity,
  setTextColor,
  setTextColorOpacity,
  setUserName,
  setImageUrl,
  setGradientType,
  setGradnentColor
} = previewSlice.actions

export default previewSlice.reducer
