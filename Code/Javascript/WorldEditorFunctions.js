class mirrorObjs extends Editor
{
	@MenuItem("Edit/Uber")
	static function Uber(command : MenuCommand)
	{
		for(var x : int = 0; x < Selection.transforms.Length; x++)
		{
			var obj : GameObject;
			obj = Selection.gameObjects[x];
			
			var normal : Transform;
			normal = Instantiate(obj.transform);
			
			var mirror : Transform;
			mirror = Instantiate(normal);
			mirror.position.y *= -1;
			mirror.rotation.SetLookRotation(-mirror.forward,-mirror.up);
			//mirror.eulerAngles = -normal.eulerAngles;
			//mirror.Rotate(Vector3(180,180,0));
			
			var tempObj : GameObject;
			
			tempObj = Instantiate(obj,mirror.position,mirror.rotation);
			tempObj.transform.RotateAround(Vector3(100,0,0),Vector3(0,0,1),180);
			
			tempObj = Instantiate(obj,mirror.position,mirror.rotation);
			tempObj.transform.RotateAround(Vector3(-100,0,0),Vector3(0,0,1),180);
			
			tempObj = Instantiate(obj,mirror.position,mirror.rotation);
			tempObj.transform.RotateAround(Vector3(0,0,100),Vector3(1,0,0),180);
			
			tempObj = Instantiate(obj,mirror.position,mirror.rotation);
			tempObj.transform.RotateAround(Vector3(0,0,-100),Vector3(1,0,0),180);
			
			tempObj = Instantiate(obj,normal.position,normal.rotation);
			tempObj.transform.Translate(Vector3(400,0,0), Space.World);
			
			tempObj = Instantiate(obj,normal.position,normal.rotation);
			tempObj.transform.Translate(Vector3(-400,0,0), Space.World);
			
			tempObj = Instantiate(obj,normal.position,normal.rotation);
			tempObj.transform.RotateAround(Vector3.zero,-Vector3.up,180);
			tempObj.transform.Translate(Vector3(200,0,200), Space.World);
			
			tempObj = Instantiate(obj,normal.position,normal.rotation);
			tempObj.transform.RotateAround(Vector3.zero,-Vector3.up,180);
			tempObj.transform.Translate(Vector3(200,0,-200), Space.World);
			
			tempObj = Instantiate(obj,normal.position,normal.rotation);
			tempObj.transform.RotateAround(Vector3.zero,-Vector3.up,180);
			tempObj.transform.Translate(Vector3(-200,0,200), Space.World);
			
			tempObj = Instantiate(obj,normal.position,normal.rotation);
			tempObj.transform.RotateAround(Vector3.zero,-Vector3.up,180);
			tempObj.transform.Translate(Vector3(-200,0,-200), Space.World);
			
			DestroyImmediate(mirror.gameObject);
			DestroyImmediate(normal.gameObject);
		}
	}
@MenuItem("Edit/Tile")
static function Tile(command : MenuCommand)
	{
	for(var x : int = 0; x < Selection.transforms.Length; x++)
		{
		var obj : GameObject;
		obj = Selection.gameObjects[x];
		
		var normal : Transform;
		normal = Instantiate(obj.transform);
		
		var mirror : Transform;
		mirror = Instantiate(normal);
		mirror.RotateAround(Vector3.zero,Vector3.up,180);
	   
	   Instantiate(obj,normal.position + Vector3(200,0,200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(200,0,-200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-200,0,200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-200,0,-200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(400,0,400),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(400,0,-400),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-400,0,400),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-400,0,-400),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(400,0,0),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(0,0,400),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-400,0,0),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(0,0,-400),normal.rotation);
	   
	   Instantiate(obj,normal.position + Vector3(200,-3000,0),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(0,-3000,200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-200,-3000,0),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(0,-3000,-200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(400,-3000,200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(200,-3000,400),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-400,-3000,200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-200,-3000,400),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-200,-3000,-400),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(-400,-3000,-200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(400,-3000,-200),normal.rotation);
	   Instantiate(obj,normal.position + Vector3(200,-3000,-400),normal.rotation);
	   
	   Instantiate(obj,mirror.position + Vector3(0,-3000,0),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(200,-3000,200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(200,-3000,-200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-200,-3000,200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-200,-3000,-200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(400,-3000,400),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(400,-3000,-400),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-400,-3000,400),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-400,-3000,-400),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(400,-3000,0),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(0,-3000,400),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-400,-3000,0),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(0,-3000,-400),mirror.rotation); 
		
	   Instantiate(obj,mirror.position + Vector3(200,0,0),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(0,0,200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-200,0,0),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(0,0,-200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(400,0,200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(200,0,400),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-400,0,200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-200,0,400),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-200,0,-400),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(-400,0,-200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(400,0,-200),mirror.rotation); 
	   Instantiate(obj,mirror.position + Vector3(200,0,-400),mirror.rotation);

		 
	   DestroyImmediate(mirror.gameObject);
	   DestroyImmediate(normal.gameObject);
	   }
	}
@MenuItem("Edit/Mirror3D")
static function Mirror3D(command : MenuCommand)
	{
	for(var x : int = 0; x < Selection.transforms.Length; x++)
		{
		Selection.transforms[x].position.y *= -1;
		Selection.transforms[x].rotation.SetLookRotation(Selection.transforms[x].forward,-Vector3.up);
		Selection.transforms[x].position.y += 2980;
		}
	}
@MenuItem("Edit/Mirror4D")
static function Mirror4D(command : MenuCommand)
	{
	for(var x : int = 0; x < Selection.gameObjects.Length; x++)
		{
		var tempObj : GameObject;
		tempObj = Instantiate(Selection.gameObjects[x],Selection.gameObjects[x].transform.position, Selection.gameObjects[x].transform.rotation);
		tempObj.transform.position.x *= -1;
		tempObj.transform.position.y -= 3000;
		tempObj.transform.eulerAngles.y *= -1;
		}
	}
}        