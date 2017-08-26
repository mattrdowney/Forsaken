Shader "A/Blood Thermometer"
	{
	Properties
		{
		_Health ("Health",Range(0.0,1.0)) = 1
		_InvHealth ("Inverse Health",Range(0.0,1.0)) = 0
		_Color ("Color", Color) = (1,0,0,1)
		_Shade ("ShadowColor", Color) = (.5,0,.5,1)
		_MainTex ("Base (RGB)", 2D) = "" //the optimized UV texture for the character
		_BackgroundTex ("BackgroundTex", 2D) = "" {TexGen ObjectLinear}
		_BloodTex ("Base (RGBA)", 2D) = "" {TexGen ObjectLinear}
		}
	SubShader
		{
		Pass
			{
			SetTexture [_BloodTex]
			}
		}
	}
