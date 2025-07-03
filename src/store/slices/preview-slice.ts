import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PreviewState {
  // Linear gradient properties
  rotation: number
  linearFirstColor: string
  linearFirstColorPosition: number
  linearFirstColorOpacity: string
  linearSecondColor: string
  linearSecondColorPosition: number
  linearSecondColorOpacity: string
  
  // Radial gradient properties
  radialFirstColor: string
  radialFirstColorPosition: number
  radialFirstColorOpacity: string
  radialSecondColor: string
  radialSecondColorPosition: number
  radialSecondColorOpacity: string
  
  // Common properties
  textColor: string
  textColorOpacity: string
  userName: string
  imageUrl: string
  gradientType: 'linear' | 'radial'
  gradientColor: string
}

const initialState: PreviewState = {
  // Linear gradient properties
  rotation: 0,
  linearFirstColor: '#165a4c',
  linearFirstColorPosition: 0,
  linearFirstColorOpacity: 'FF',
  linearSecondColor: '#91db69',
  linearSecondColorPosition: 100,
  linearSecondColorOpacity: 'FF',
  
  // Radial gradient properties
  radialFirstColor: '#3ddb82',
  radialFirstColorPosition: 66,
  radialFirstColorOpacity: 'FF',
  radialSecondColor: '#1c1c45',
  radialSecondColorPosition: 34,
  radialSecondColorOpacity: 'FF',
  
  // Common properties
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
    setLinearFirstColor: (state, action: PayloadAction<string>) => {
      state.linearFirstColor = action.payload
    },
    setLinearFirstColorPosition: (state, action: PayloadAction<number>) => {
      state.linearFirstColorPosition = action.payload
    },
    setLinearFirstColorOpacity: (state, action: PayloadAction<string>) => {
      state.linearFirstColorOpacity = action.payload
    },
    setLinearSecondColor: (state, action: PayloadAction<string>) => {
      state.linearSecondColor = action.payload
    },
    setLinearSecondColorPosition: (state, action: PayloadAction<number>) => {
      state.linearSecondColorPosition = action.payload
    },
    setLinearSecondColorOpacity: (state, action: PayloadAction<string>) => {
      state.linearSecondColorOpacity = action.payload
    },
    setRadialFirstColor: (state, action: PayloadAction<string>) => {
      state.radialFirstColor = action.payload
    },
    setRadialFirstColorPosition: (state, action: PayloadAction<number>) => {
      state.radialFirstColorPosition = action.payload
    },
    setRadialFirstColorOpacity: (state, action: PayloadAction<string>) => {
      state.radialFirstColorOpacity = action.payload
    },
    setRadialSecondColor: (state, action: PayloadAction<string>) => {
      state.radialSecondColor = action.payload
    },
    setRadialSecondColorPosition: (state, action: PayloadAction<number>) => {
      state.radialSecondColorPosition = action.payload
    },
    setRadialSecondColorOpacity: (state, action: PayloadAction<string>) => {
      state.radialSecondColorOpacity = action.payload
    },
    setTextColor: (state, action: PayloadAction<string>) => {
      state.textColor = action.payload
    },
    setTextColorOpacity: (state, action: PayloadAction<string>) => {
      state.textColorOpacity = action.payload
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload
    },
    setImageUrl: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload
    },
    setGradientType: (state, action: PayloadAction<'linear' | 'radial'>) => {
      state.gradientType = action.payload
      if (action.payload === 'linear') {
        state.linearFirstColorPosition = 0
        state.linearFirstColorOpacity = 'FF'
        state.linearSecondColorPosition = 100
        state.linearSecondColorOpacity = 'FF'
        state.radialFirstColor = ''
        state.radialFirstColorPosition = 0
        state.radialFirstColorOpacity = ''
        state.radialSecondColor = ''
        state.radialSecondColorPosition = 0
        state.radialSecondColorOpacity = ''
        state.gradientColor = ''
      } else {
        state.radialFirstColor = '#3ddb82'
        state.radialFirstColorPosition = 66
        state.radialFirstColorOpacity = 'FF'
        state.radialSecondColor = '#1c1c45'
        state.radialSecondColorPosition = 34
        state.radialSecondColorOpacity = 'FF'
        state.gradientColor = 'radial-gradient(circle at 66% 34%, #3ddb82 0%, #1c1c45 100%)'
      }
    },
    setGradientColor: (state, action: PayloadAction<string>) => {
      state.gradientColor = action.payload
    }
  },
})

export const {
  setRotation,
  setLinearFirstColor,
  setLinearFirstColorPosition,
  setLinearFirstColorOpacity,
  setLinearSecondColor,
  setLinearSecondColorPosition,
  setLinearSecondColorOpacity,
  setRadialFirstColor,
  setRadialFirstColorPosition,
  setRadialFirstColorOpacity,
  setRadialSecondColor,
  setRadialSecondColorPosition,
  setRadialSecondColorOpacity,
  setTextColor,
  setTextColorOpacity,
  setUserName,
  setImageUrl,
  setGradientType,
  setGradientColor
} = previewSlice.actions

export default previewSlice.reducer
