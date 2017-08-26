//#pragma strict
	
function Start()
	{
	//locks all rotation outside of scripting (for instance, locks rotation during collisions)
	if(rigidbody) rigidbody.freezeRotation = true;
	//set initial rotation in x and y, i.e. looking down
	eye.xRot = 0;
	eye.yRot = -90;
	}

function OnCollisionEnter(body : Collision)
	{
	Collide(body);
	}
	
function OnCollisionStay(body : Collision)
	{
	Collide(body);
	}

function OnCollisionExit()
	{
	muscle.useGravity = true;
	}

function Update ()
	{
	if(vein.dead && Input.GetButtonUp ("Fire"))
		{
		Spawn();
		}
	if(vein.dead)
		{
		Screen.showCursor = true;
		Cam.camera.enabled = false;
		OrthCam.camera.enabled = true;
		Lit.light.enabled = true;
		}
	else
		{
		BPM ();
		Screen.showCursor = false;
		Cam.camera.enabled = true;
		OrthCam.camera.enabled = false;
		Lit.light.enabled = false;
		if(muscle.useGravity || muscle.jumped) Gravitate();
		if((!muscle.useGravity || muscle.grounded) && muscle.velocity.y < 0) muscle.velocity = Vector3.zero;
		if(vein.blood != vein.maxBlood && vein.regen != vein.maxRegen) Health();
		Rigid.velocity = Vector3.zero;
		Warp2();
		if(Input.GetButtonDown("Jump")) IWannaJump();
		if((Time.time - muscle.lastButtonDownTime < 0.2) && (muscle.grounded || !muscle.useGravity) && !muscle.jumped) Jump();
		TunnelVision();
		Move();
		}
	if(Input.GetKey ("escape")) Application.Quit();
	}

function FixedUpdate ()
	{
	if(!vein.dead)
		{
		muscle.grounded = Footing();
		if(!muscle.useGravity || muscle.grounded) FindSpeed();
		if((!muscle.useGravity || muscle.grounded) && !muscle.jumped) Pace();
		Rotate();
		}
	}

function ApplyBleed(bleed : float)
	{
	vein.regen -= bleed;
	}

function ApplyDamage(damage : float)
	{
	vein.blood -= damage;
	}

function ApplyPellet (vel : Vector3)
	{
	muscle.velocity += vel; //Trans.TransformDirection(vel);
	}

//A function that ensures no division by zero
function Atan3(y : float, x : float)
	{
	if(x == 0)
		{
		if(y >= 0)
			{
			return Mathf.PI/2;
			}
		else
			{
			return -Mathf.PI/2;
			}
		}
	else return Mathf.Atan2(y,x);
	}

private function BPM ()
	{
	//effort is 1 if the player is sprinting, 0 if standing still
	heart.effort = muscle.moveSpeed / muscle.maxRealSpeed;
	
	//based on effort, where heartrate wants to be
	heart.targetVelocity = (heart.minV/160)*(heart.heartrate - heart.tempMinHeartrate) + heart.maxV*heart.effort;
	
	//accelerate the heartrate so that it reaches targetVelocity
	if       (heart.targetVelocity > heart.curV)  heart.curA = heart.maxA;
	else if  (heart.targetVelocity < heart.curV)  heart.curA = heart.minA;
	else                                          heart.curA = 0;
	
	//enforce acceleration
	heart.curV += heart.curA*Time.deltaTime;
	heart.heartrate += heart.curV*Time.deltaTime;
	
	if        (heart.curV < heart.minV) heart.curV = heart.minV;
	else if   (heart.curV > heart.maxV) heart.curV = heart.maxV;
	
	//enforce minimum and maximum heartrate
	if       (heart.heartrate < heart.tempMinHeartrate) heart.heartrate = heart.tempMinHeartrate;
	else if  (heart.heartrate > heart.tempMaxHeartrate) heart.heartrate = heart.tempMaxHeartrate;

	//Create the heartrate modifier that affects all of the player's actions
	heart.modifier = (heart.heartrate + 125)/160;

	//Display Heartrate on Gun
	GUIBPM.text = Mathf.Round(heart.heartrate).ToString();
	}

//Clamp Function
function ClampAngleX(angle : float)
	{
	while(angle < -360)
	angle += 360;
	while(angle > 360)
	angle -= 360;
	return angle;
	}

function ClampAngleY(angle : float, min : float, max : float)
	{
	return Mathf.Clamp(angle, min, max);
	}

function Collide (body : Collision)
	{
	var x : int;
	muscle.floorArr.Clear();
	var maxYValue = Mathf.Max(body.contacts[(body.contacts.Length - 1)].normal.y);
	for(x = 0; x < body.contacts.Length; x++)
		{
		if(body.contacts[x].normal.y > 0.05)
			{
			muscle.velocity = Vector3.zero;
			muscle.floorArr.Push(body.contacts[x].normal);
			if(body.contacts[x].normal.y == maxYValue)
				{
				muscle.normal = body.contacts[x].normal;
				}
			}
		else if(body.contacts[x].normal.y < -0.05)
			{
			if(Vector3.Dot(muscle.velocity,body.contacts[x].normal) < 0) muscle.velocity -= Vector3.Project(muscle.velocity, body.contacts[x].normal);
			}
		else
			{
			if(Time.time - muscle.lastButtonDownTime < 0.2 && muscle.useGravity && !muscle.grounded) WallJump(body.contacts[x].normal);
			}
		}
	if(muscle.floorArr.length > 0)
		{
		muscle.useGravity = false;
		muscle.jumped = false;
		}
	else
		{
		muscle.useGravity = true;
		}
	}

function FindSpeed ()
	{
	//Find the max speed, which is base speed times sprinting multiplier (constant value), multiplied by heartrate multiplier (variable)
	muscle.maxRealSpeed = muscle.sprintMult*muscle.baseSpeed*heart.modifier;
	
	//Normalize the movement vector.  Optimized.
	if(Mathf.Pow(Input.GetAxis("Vertical"),2) + Mathf.Pow(Input.GetAxis("Horizontal"),2) >= 1)
		{
		muscle.normalSpeed = 1;
		}
	else if (Input.GetAxis("Vertical") == 0 && Input.GetAxis("Horizontal") == 0)
		{
		muscle.normalSpeed = 0;
		}
	else
		{
		muscle.normalSpeed = Mathf.Sqrt(Mathf.Pow(Input.GetAxis("Vertical"),2) + Mathf.Pow(Input.GetAxis("Horizontal"),2));
		}
	//Find speed assuming the player is holding sprint.
	muscle.moveSpeed = muscle.maxRealSpeed * muscle.normalSpeed;
	//If the player is not sprinting, divide by sprint multiplier.
	if(!Input.GetButton("Sprint")) muscle.moveSpeed /= muscle.sprintMult; 
	}

function Footing ()
	{
	var foot : RaycastHit;
	if(!muscle.jumped)
		{
		if(Physics.Raycast(Trans.position,-Vector3.up,foot,Coll.height/2 + 0.01,~LayerMask.NameToLayer("Default")))
			{
			if(foot.normal.y > 0.05)
				{
				if(!muscle.jumped) muscle.normal = foot.normal;
				if(foot.collider.tag == "Player") muscle.normal = Vector3(0,1,0);
				if(muscle.velocity.y < 0 || Vector3.Dot(muscle.velocity, foot.normal) < 0) muscle.velocity = Vector3.zero;
				return true;
				}
			else if(Physics.SphereCast(Trans.position, Coll.radius, Vector3(0,-1,0), foot, Coll.height/2 - Coll.radius/2 + 0.01, ~LayerMask.NameToLayer("Default")))
				{
				if(foot.normal.y > 0.05)
					{
					if(!muscle.jumped) muscle.normal = foot.normal;
					if(foot.collider.tag == "Player") muscle.normal = Vector3(0,1,0);
					if(muscle.velocity.y < 0 || Vector3.Dot(muscle.velocity, foot.normal) < 0) muscle.velocity = Vector3.zero;
					return true;
					}
				else
					{
					muscle.normal = Vector3.up;
					return false;
					}
				}
			}
		else if(Physics.SphereCast(Trans.position, Coll.radius, Vector3(0,-1,0), foot, Coll.height/2 - Coll.radius/2 + 0.01, ~LayerMask.NameToLayer("Default")))
			{
			if(foot.normal.y > 0.05)
				{
				if(!muscle.jumped) muscle.normal = foot.normal;
				if(foot.collider.tag == "Player") muscle.normal = Vector3(0,1,0);
				if(muscle.velocity.y < 0 || Vector3.Dot(muscle.velocity, foot.normal) < 0) muscle.velocity = Vector3.zero;
				return true;
				}
			else
				{
				muscle.normal = Vector3.up;
				return false;
				}
			}
		}
	}
	
function Gravitate ()
	{
	muscle.velocity += muscle.gravitation*muscle.down*Time.deltaTime;
	}

function Health ()
	{
	if(vein.regen>vein.maxRegen) vein.regen = vein.maxRegen;
	vein.regen += vein.recovery*Time.deltaTime; 

	if(vein.blood>vein.maxBlood) vein.blood = vein.maxBlood;
	if(vein.blood<vein.minBlood)
		{
		vein.dead = true;
		vein.blood = vein.maxBlood;
		vein.regen = vein.maxRegen;
		}
	vein.blood += vein.regen*Time.deltaTime;
	}

function IWannaJump ()
	{
	muscle.lastButtonDownTime = Time.time;
	}

function Jump ()
	{
	muscle.maxRealJump = muscle.baseJump*heart.modifier;
	muscle.jumpSpeed = Mathf.Sqrt(muscle.maxRealJump*19.6);
	muscle.velocity.y = muscle.jumpSpeed;
	muscle.normal = Vector3(0,1,0);
	FindSpeed();
	Pace();
	muscle.lastButtonDownTime = Time.time;
	muscle.jumped = true;
	muscle.lastButtonDownTime = -100;
	}

function Move ()
	{
	Trans.Translate(Trans.InverseTransformDirection(eye.direction)*muscle.moveSpeed*Time.deltaTime + Time.deltaTime*muscle.velocity);
	}	

private function Pace ()
	{
	//direction in x-z the player would move (accounts for player rotation and WASD)
	var moveAngle : float = Atan3(Input.GetAxis("Vertical"),Input.GetAxis("Horizontal")) + Mathf.Deg2Rad*eye.xRot;
	//By dot product/negative inverse, this is orthogonal to the normal
	var right : Vector3 = Vector3(muscle.normal.y,-muscle.normal.x,0);
	var forward : Vector3 = Vector3(0,-muscle.normal.z,muscle.normal.y);
	//the direction the player will move (tangential)
	eye.direction = right*Mathf.Cos(moveAngle) + forward*Mathf.Sin(moveAngle);
	eye.direction.Normalize();
	}
	
//Rotation Update Script
function Rotate ()
	{
	//Inputs
	eye.xInput = Input.GetAxis("Mouse X") * eye.xSen;
	eye.yInput = Input.GetAxis("Mouse Y") * eye.ySen;
	
	if(eye.xInput != 0 && eye.yInput != 0)
		{
		//Rotation
		eye.xRot -= eye.xInput;
		eye.yRot += eye.yInput;
	
		//clamp the rotation
		eye.xRot = ClampAngleX(eye.xRot);
		eye.yRot = ClampAngleY(eye.yRot, eye.yMin, eye.yMax);
	
		//Rotate body, then the camera for head tilt
		Trans.localEulerAngles = Vector3(0,-eye.xRot,0);
		Cam.transform.localEulerAngles = Vector3(-eye.yRot,0, 0);
		}
	}

function Spawn ()
	{
	var godRay : Ray;
	var godRayHit : RaycastHit;
		
	godRay = OrthCam.camera.ViewportPointToRay(Vector3(Input.mousePosition.x/Screen.width,Input.mousePosition.y/Screen.height,0));
	if(Physics.Raycast(godRay, godRayHit))
		{
		Trans.position = Vector3(godRayHit.point.x,godRayHit.point.y + 500,godRayHit.point.z);
		Trans.rotation = Quaternion.Euler(0,0,0);
		Cam.transform.rotation = Quaternion.Euler(90,0,0);
		muscle.velocity = Vector3(0,-100,0);
		vein.dead = false;
		eye.xRot = 0;
		eye.yRot = -90;
		}
	}

function TunnelVision ()
	{
	Vis.light.intensity = .47*vein.blood/vein.maxBlood;
	}

function WallJump (normal : Vector3)
	{
	muscle.normal = Vector3(0,1,0);
	var oldDirection : Vector3;
	var velocity : Vector3;
	oldDirection = eye.direction;
	velocity = muscle.velocity;
	if(muscle.velocity.y < 0) muscle.velocity.y = 0;
	eye.direction = Vector3.Reflect(eye.direction*muscle.moveSpeed + muscle.velocity, normal);
	muscle.moveSpeed = eye.direction.magnitude;
	if(muscle.moveSpeed > muscle.maxRealSpeed) muscle.moveSpeed = muscle.maxRealSpeed;
	eye.direction.Normalize();
	var jumpHeight : float;
	var jumpSpeed : float;
	muscle.maxRealJump = muscle.baseJump*heart.modifier;
	var potMag : float;
	var mag : float;
	potMag = eye.direction.magnitude*2;
	mag = (eye.direction - oldDirection).magnitude;
	jumpHeight = muscle.maxRealJump*mag/potMag;
	jumpSpeed = Mathf.Sqrt(jumpHeight*19.6);
	muscle.velocity = Vector3.up*jumpSpeed + normal*0.2;
	muscle.lastButtonDownTime = -100;
	}
	
function Warp2 ()
	{
	if(Trans.position.x > 100)
		{
		Trans.position.x -= 200;
		if(Trans.position.y > 0) Trans.position.y -= 3000;
		else Trans.position.y += 3000;
		}
	else if(Trans.position.x < -100)
		{
		Trans.position.x += 200;
		if(Trans.position.y > 0) Trans.position.y -= 3000;
		else Trans.position.y += 3000;
		}
	if(Trans.position.z > 100)
		{
		Trans.position.z -= 200;
		if(Trans.position.y > 0) Trans.position.y -= 3000;
		else Trans.position.y += 3000;
		}
	else if(Trans.position.z < -100)
		{
		Trans.position.z += 200;
		if(Trans.position.y > 0) Trans.position.y -= 3000;
		else Trans.position.y += 3000;
		}
	}

//caching to save memory
private var Trans : Transform;
Trans = transform;

private var Rigid : Rigidbody;
Rigid = rigidbody;

private var Cam : GameObject;
Cam = gameObject.Find("Camera");

var GUIBPM : TextMesh;

private var Coll : CapsuleCollider;
Coll = collider;

private var Vis : GameObject;
Vis = Cam.Find("Vision");

private var OrthCam : GameObject;
OrthCam = gameObject.Find("/OrthCam");

var Sub : ProceduralMaterial;

private var Lit : GameObject;
Lit = OrthCam.Find("Directional light");

var projectile : GameObject;

var Laser : GameObject;
var Muzzle : GameObject;
var Stock : GameObject;
var Primary : GameObject;
var Secondary : GameObject;
var Tertiary : GameObject;
var Melee : GameObject;
var Equip : GameObject = Primary;

//public variables here
var GuiEnabled : boolean = false;

//almost all variables in characterComplex are stored in classes outside of the functions

//contains elements that influence and determine heartrate
private class Heart
	{
	var heartrate : float = 40;
	var maxHeartrate : float = 215;
	var minHeartrate : float = 15;
	var tempMaxHeartrate : float = 195;
	var tempMinHeartrate : float = 35;
	
	var maxV : float = 10;
	var minV : float = -10;
	var curV : float = 0;
	
	var maxA : float = 2;
	var minA : float = -2;
	var curA : float = 0;

	var targetVelocity : float;;
	var effort : float;
	
	var modifier : float = 1;
	}

private var heart : Heart = Heart();

//contains elements related to health
private class Vein
	{
	var dead : boolean = true;
	
	var blood : float = 1000;
	var maxBlood : float = 1000;
	var minBlood : float = 0;
	
	var regen : float = 200;
	var maxRegen : float = 200;
	
	var recovery : float = 200;
	}

private var vein : Vein = Vein();

//contains elements related to collisions, movement and shooting
private class Muscle
	{
	var normalSpeed : float = 0;
	var moveSpeed : float = 0;
		
	var baseSpeed : float = 2.8333;
	var baseJump : float = 1.4;
	var jumpSpeed : float = 1;
	
	var maxRealSpeed : float = 2.8333;
	var maxRealJump : float = 1.4;
	var lastButtonDownTime : float = -100;
	var jumped : boolean = false;
	
	var sprintMult : float = 8;
	
	var normal : Vector3 = Vector3(0,1,0);
	var floorArr = new Array(Vector3(0,0,0));
	var useGravity : boolean = true;
	var gravitation : float = 9.8;
	var velocity : Vector3 = Vector3.zero;
	var down : Vector3 = -Vector3.up;
	var grounded : boolean = false;
	
	//Debug values
	var pos1 : Vector3 = Vector3.zero;
	var pos2 : Vector3 = Vector3.zero;
	}
	
private var muscle : Muscle = Muscle();

//contains elements related to cameras
private class Eye
	{	
	// Left/Right Sensitivity
	var xSen : float = 15F;
	// Up/Down Sensitivity
	var ySen : float = 15F;

	//Why have more than 360 degrees?
	var xMin : float = -360F;
	var xMax : float = 360F;
	//Neck Limit
	var yMin : float = -90F;
	var yMax : float = 90F;

	//Mouse Input
	var xInput : float = 0F;
	var yInput : float = 0F;

	//Rotation
	var xRot : float = 0F;
	var yRot : float = 0F;
	
	var direction : Vector3 = Vector3(0,0,0);
	}
	
private var eye : Eye = Eye();