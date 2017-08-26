Shader "ReDiffuse (2 UV sets)"
	{

	Properties
		{
    	_Color ("Main Color", Color) = (1,1,1,1)
    	_MainTex ("Texture1 (RGB)", 2D) = "white" {TexGen ObjectLinear}
    	_Texture2 ("Texture2 (RGB)", 2D) = "white" {TexGen ObjectLinear}
		}

	SubShader
		{
    	Pass
    		{
    		Material
    			{
				Diffuse [_Color]
    			}

			Lighting On

        	BindChannels
        		{
            	Bind "texcoord", texcoord0 // main uses 1st uv
            	//Bind "texcoord1", texcoord1 // texture2 uses 2nd uv
        		}
        	SetTexture[_MainTex]
        		{
        		constantColor [_Color]
				Combine texture * primary DOUBLE
        		}
        	SetTexture[_Texture2]
        		{
        		//Combine texture * previous
        		}
    		}
		}
	Fallback "Diffuse"
	}