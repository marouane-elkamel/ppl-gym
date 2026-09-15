// Training program content for the PPL Gym app.
// Exercise photos: free-exercise-db (public domain), https://github.com/yuhonas/free-exercise-db

export const IMG_DIR = "img/";

export const EXERCISES = {
  "chest_press": {
    "name": "Machine Chest Press",
    "dbId": "Leverage_Chest_Press",
    "muscles": "Chest, front shoulders, triceps",
    "equipment": "Machine",
    "setup": "Set the seat so the handles line up with the middle of your chest. Feet flat on the floor, back against the pad.",
    "steps": [
      "Squeeze your shoulder blades together and keep your chest up.",
      "Press the handles forward until your arms are almost straight (don't lock the elbows).",
      "Pause 1 second, then bring the handles back slowly (2-3 seconds) until you feel a stretch in your chest.",
      "Don't let the weight stack touch down between reps."
    ],
    "mistakes": [
      "Seat too high or too low, so your shoulders do the work",
      "Shoulders rolling forward at the end of the press",
      "Bouncing the weight or rushing the reps"
    ],
    "swap": "Smith Machine Bench Press, or Dumbbell Bench Press with light dumbbells."
  },
  "incline_press": {
    "name": "Incline Machine Press",
    "dbId": "Leverage_Incline_Chest_Press",
    "muscles": "Upper chest, front shoulders, triceps",
    "equipment": "Machine",
    "setup": "Adjust the seat so the handles start at upper-chest height (around your collarbone).",
    "steps": [
      "Shoulder blades squeezed back, chest up, back against the pad.",
      "Press up and forward until your arms are almost straight.",
      "Lower slowly (2-3 seconds) until the handles are back near your upper chest."
    ],
    "mistakes": [
      "Arching your lower back off the pad",
      "Elbows flared straight out to the sides; keep them at about 45-60 degrees"
    ],
    "swap": "Smith Machine Incline Press, or Incline Dumbbell Press."
  },
  "shoulder_press": {
    "name": "Machine Shoulder Press",
    "dbId": "Leverage_Shoulder_Press",
    "muscles": "Shoulders, triceps",
    "equipment": "Machine",
    "setup": "Set the seat so the handles start just above shoulder height. Keep your back flat against the pad.",
    "steps": [
      "Brace your abs like someone is about to poke your stomach.",
      "Press the handles overhead until your arms are almost straight.",
      "Lower slowly back to shoulder level."
    ],
    "mistakes": [
      "Arching your lower back to push the weight up",
      "Shrugging your shoulders up to your ears",
      "Only doing half reps"
    ],
    "swap": "Seated Dumbbell Shoulder Press (back supported)."
  },
  "pec_deck": {
    "name": "Pec Deck (Machine Fly)",
    "dbId": "Butterfly",
    "muscles": "Chest",
    "equipment": "Machine",
    "setup": "Set the seat so the handles are at chest height. Keep a slight bend in your elbows the whole time.",
    "steps": [
      "Imagine hugging a big tree.",
      "Bring the handles together in front of your chest and squeeze for 1 second.",
      "Open your arms slowly until you feel a stretch in your chest; don't go further than feels comfortable for your shoulders."
    ],
    "mistakes": [
      "Going so heavy that you bend your arms and turn it into a press",
      "Letting the arms fly back too far"
    ],
    "swap": "Cable Crossover (standing between two high cables)."
  },
  "lateral_raise": {
    "name": "Dumbbell Lateral Raise",
    "dbId": "Side_Lateral_Raise",
    "muscles": "Side shoulders (makes shoulders look wider)",
    "equipment": "Dumbbells (free weight)",
    "setup": "Pick LIGHT dumbbells (start around 4-6 kg). Stand tall, soft knees, slight bend in the elbows.",
    "steps": [
      "Raise your arms out to the sides, leading with your elbows.",
      "Stop at shoulder height; your arms make a T.",
      "Lower slowly (2-3 seconds). Don't rest at the bottom."
    ],
    "mistakes": [
      "Swinging your body to lift the weight (too heavy)",
      "Lifting higher than your shoulders",
      "Shrugging your shoulders up"
    ],
    "swap": "Cable Lateral Raise, or the Lateral Raise machine."
  },
  "rope_pushdown": {
    "name": "Rope Triceps Pushdown",
    "dbId": "Triceps_Pushdown_-_Rope_Attachment",
    "muscles": "Triceps (back of the arm)",
    "equipment": "Cable machine + rope",
    "setup": "Attach the rope to the high pulley. Stand close, lean forward slightly, elbows pinned to your sides.",
    "steps": [
      "Push the rope down until your arms are straight.",
      "At the bottom, pull the rope ends apart and squeeze your triceps for 1 second.",
      "Let the rope come back up slowly until your forearms are about parallel to the floor."
    ],
    "mistakes": [
      "Elbows moving forward and back (keep them glued to your sides)",
      "Leaning over the rope and using body weight"
    ],
    "swap": "Straight-bar pushdown, or the Triceps Extension machine."
  },
  "plank": {
    "name": "Plank",
    "dbId": "Plank",
    "muscles": "Core (abs and lower back)",
    "equipment": "Mat (body weight)",
    "setup": "Forearms on a mat, elbows directly under your shoulders, legs straight behind you.",
    "steps": [
      "Make a straight line from head to heels.",
      "Squeeze your glutes and abs, and breathe normally.",
      "Hold for 30-45 seconds. Log the seconds in the reps column."
    ],
    "mistakes": [
      "Hips sagging toward the floor",
      "Butt sticking up in the air",
      "Holding your breath"
    ],
    "swap": "Dead Bug (lying on your back, slowly lowering opposite arm and leg)."
  },
  "lat_pulldown": {
    "name": "Wide-Grip Lat Pulldown",
    "dbId": "Wide-Grip_Lat_Pulldown",
    "muscles": "Lats (back width), biceps",
    "equipment": "Cable machine",
    "setup": "Adjust the knee pad so your thighs are locked in. Grip the bar a bit wider than your shoulders.",
    "steps": [
      "Lean back slightly (about 15 degrees) with your chest up.",
      "Pull the bar to your upper chest by driving your elbows down toward your sides.",
      "Squeeze your back for 1 second, then let the bar rise slowly until your arms are straight."
    ],
    "mistakes": [
      "Pulling the bar behind your neck",
      "Swinging your body back to move the weight",
      "Pulling with your hands instead of your elbows"
    ],
    "swap": "Assisted Pull-Up machine, or Close-Grip Lat Pulldown."
  },
  "cable_row": {
    "name": "Seated Cable Row",
    "dbId": "Seated_Cable_Rows",
    "muscles": "Middle back, lats, biceps",
    "equipment": "Cable machine + V-handle",
    "setup": "Attach the V-handle. Feet on the platform, knees slightly bent, sit tall.",
    "steps": [
      "Pull the handle to your belly button, keeping your elbows close to your body.",
      "Squeeze your shoulder blades together for 1 second.",
      "Return slowly, letting your arms straighten while your back stays straight."
    ],
    "mistakes": [
      "Rocking your torso back and forth",
      "Rounding your lower back",
      "Shrugging your shoulders"
    ],
    "swap": "Chest-supported Machine Row."
  },
  "db_row": {
    "name": "One-Arm Dumbbell Row",
    "dbId": "One-Arm_Dumbbell_Row",
    "muscles": "Lats, middle back, biceps",
    "equipment": "Dumbbell + flat bench (free weight)",
    "setup": "Left knee and left hand on a flat bench, right foot on the floor. Back flat like a table. Dumbbell in your right hand.",
    "steps": [
      "Pull the dumbbell toward your hip (not your chest), elbow close to your body.",
      "Squeeze your back for 1 second at the top.",
      "Lower slowly until your arm is straight. Do all reps, then switch sides.",
      "Log the weight of ONE dumbbell and the reps for ONE arm."
    ],
    "mistakes": [
      "Twisting your torso to lift the weight",
      "Rounding your back",
      "Jerking the dumbbell up"
    ],
    "swap": "Machine Row."
  },
  "reverse_pec_deck": {
    "name": "Reverse Pec Deck",
    "dbId": "Reverse_Machine_Flyes",
    "muscles": "Rear shoulders, upper back (good for posture)",
    "equipment": "Machine (same as the Pec Deck)",
    "setup": "Sit FACING the pad. Set the handles to the back position. Arms straight out in front at shoulder height.",
    "steps": [
      "Open your arms out wide in an arc until they line up with your body.",
      "Squeeze for 1 second.",
      "Return slowly to the front."
    ],
    "mistakes": [
      "Using too much weight and swinging your back",
      "Shrugging your shoulders"
    ],
    "swap": "Face Pull on a cable with a rope, or Cable Rear Delt Fly."
  },
  "preacher_curl": {
    "name": "Machine Preacher Curl",
    "dbId": "Machine_Preacher_Curls",
    "muscles": "Biceps",
    "equipment": "Machine",
    "setup": "Set the seat so your armpits sit snugly over the top of the pad.",
    "steps": [
      "Curl the handles up and squeeze your biceps.",
      "Lower slowly all the way until your arms are nearly straight."
    ],
    "mistakes": [
      "Lifting your butt off the seat",
      "Dropping the weight fast at the bottom (hard on the elbows)",
      "Only doing half reps"
    ],
    "swap": "Dumbbell Bicep Curl, or Cable Curl."
  },
  "hammer_curl": {
    "name": "Dumbbell Hammer Curl",
    "dbId": "Hammer_Curls",
    "muscles": "Biceps, forearms",
    "equipment": "Dumbbells (free weight)",
    "setup": "Stand tall, dumbbells at your sides, palms facing your body (like holding two hammers).",
    "steps": [
      "Curl both dumbbells up, keeping your palms facing in.",
      "Keep your elbows at your sides.",
      "Lower slowly."
    ],
    "mistakes": [
      "Swinging your body",
      "Elbows drifting forward"
    ],
    "swap": "Cable Rope Hammer Curl."
  },
  "ab_crunch": {
    "name": "Ab Crunch Machine",
    "dbId": "Ab_Crunch_Machine",
    "muscles": "Abs",
    "equipment": "Machine",
    "setup": "Set the seat so the pads rest on your upper chest or shoulders. Hook your feet under the rollers.",
    "steps": [
      "Breathe out and curl your chest toward your hips, rounding your spine (think ribs to belly button).",
      "Pause for 1 second.",
      "Return slowly."
    ],
    "mistakes": [
      "Pulling with your arms",
      "Going so heavy that your hips do the work instead of your abs"
    ],
    "swap": "Cable Crunch (kneeling, rope on the high pulley)."
  },
  "leg_press": {
    "name": "Leg Press",
    "dbId": "Leg_Press",
    "muscles": "Quads, glutes, hamstrings",
    "equipment": "Machine",
    "setup": "Back and hips flat on the pad. Feet shoulder-width apart in the middle of the platform.",
    "steps": [
      "Push the platform up a little and release the safety handles.",
      "Lower slowly until your knees are at about 90 degrees.",
      "Push through your whole foot (heels) back up. Stop just before your knees lock.",
      "After the last rep, lock the safety handles again."
    ],
    "mistakes": [
      "Locking your knees at the top",
      "Going so deep that your lower back lifts off the pad",
      "Knees caving inward"
    ],
    "swap": "Hack Squat, or Smith Machine Squat."
  },
  "goblet_squat": {
    "name": "Goblet Squat",
    "dbId": "Goblet_Squat",
    "muscles": "Quads, glutes, core",
    "equipment": "One dumbbell or kettlebell (free weight)",
    "setup": "Hold one dumbbell upright against your chest with both hands. Feet a bit wider than your shoulders, toes slightly out.",
    "steps": [
      "Sit your hips back and down between your heels, chest up.",
      "Let your knees follow the direction of your toes.",
      "Go as deep as you can while your back stays flat.",
      "Push through the middle of your feet to stand back up."
    ],
    "mistakes": [
      "Heels lifting off the floor",
      "Knees caving inward",
      "Rounding your back at the bottom"
    ],
    "swap": "Smith Machine Squat."
  },
  "leg_curl": {
    "name": "Seated Leg Curl",
    "dbId": "Seated_Leg_Curl",
    "muscles": "Hamstrings (back of the thigh)",
    "equipment": "Machine",
    "setup": "Back against the pad, knees lined up with the machine's pivot point. Lower pad just above your heels; lock the thigh pad down snugly.",
    "steps": [
      "Curl your heels down and back under the seat.",
      "Squeeze for 1 second.",
      "Return slowly."
    ],
    "mistakes": [
      "Hips lifting off the seat",
      "Letting the weight snap back up"
    ],
    "swap": "Lying Leg Curl machine."
  },
  "leg_extension": {
    "name": "Leg Extension",
    "dbId": "Leg_Extensions",
    "muscles": "Quads (front of the thigh)",
    "equipment": "Machine",
    "setup": "Knees lined up with the machine's pivot point; ankle pad on the front of your lower shins.",
    "steps": [
      "Straighten your legs and squeeze your quads for 1 second at the top.",
      "Lower slowly (2-3 seconds)."
    ],
    "mistakes": [
      "Kicking or swinging the weight up",
      "Lifting your butt off the seat"
    ],
    "swap": "Single-leg Leg Extension, or Dumbbell Split Squat."
  },
  "db_rdl": {
    "name": "Dumbbell Romanian Deadlift",
    "dbId": "Stiff-Legged_Dumbbell_Deadlift",
    "muscles": "Hamstrings, glutes, lower back",
    "equipment": "Dumbbells (free weight)",
    "setup": "Start LIGHT. Stand with dumbbells in front of your thighs, feet hip-width, knees slightly bent (they stay that way).",
    "steps": [
      "Push your hips back, like closing a car door with your butt.",
      "Slide the dumbbells down the front of your legs, keeping your back flat.",
      "Stop when you feel a strong stretch in your hamstrings (usually just below the knees).",
      "Squeeze your glutes and push your hips forward to stand up."
    ],
    "mistakes": [
      "Rounding your back",
      "Squatting down instead of pushing your hips back",
      "Dumbbells drifting away from your legs"
    ],
    "swap": "Smith Machine Stiff-Legged Deadlift."
  },
  "hip_abductor": {
    "name": "Hip Abductor Machine",
    "dbId": "Thigh_Abductor",
    "muscles": "Outer glutes (hip stability)",
    "equipment": "Machine",
    "setup": "Pads on the outside of your knees. Sit tall (leaning slightly forward works the glutes more).",
    "steps": [
      "Push your legs apart as wide as you can.",
      "Pause for 1 second.",
      "Return slowly without letting the weights touch."
    ],
    "mistakes": [
      "Slamming the weights together",
      "Going too heavy and only moving a few centimetres"
    ],
    "swap": "Cable Hip Abduction, or band side-walks."
  },
  "seated_calf": {
    "name": "Seated Calf Raise",
    "dbId": "Seated_Calf_Raise",
    "muscles": "Calves",
    "equipment": "Machine",
    "setup": "Balls of your feet on the edge of the platform, pad snug on your lower thighs.",
    "steps": [
      "Release the safety lever.",
      "Lower your heels as far as possible and pause 1 second in the stretch.",
      "Rise onto your toes as high as possible and squeeze for 1 second."
    ],
    "mistakes": [
      "Bouncing at the bottom",
      "Only moving a tiny range"
    ],
    "swap": "Calf Press on the Leg Press machine."
  },
  "warm_bike": {
    "name": "Easy Bike or Elliptical",
    "dbId": "Bicycling_Stationary",
    "muscles": "Heart and legs: gets your body warm",
    "equipment": "Stationary bike or elliptical",
    "setup": "Seat height: your knee should be slightly bent when the pedal is at the bottom.",
    "steps": [
      "Pedal at an easy pace for 5 minutes (about level 3-5 of 10).",
      "You should feel warmer and breathe a bit faster, but still be able to chat."
    ],
    "mistakes": null,
    "swap": "Elliptical or rowing machine at an easy pace."
  },
  "arm_circles": {
    "name": "Arm Circles",
    "dbId": "Arm_Circles",
    "muscles": "Shoulders",
    "equipment": "None",
    "setup": null,
    "steps": [
      "Stand tall with your arms straight out to the sides.",
      "Make small circles forward, growing bigger, for 10 reps.",
      "Repeat 10 backwards."
    ],
    "mistakes": null,
    "swap": null
  },
  "shoulder_circles": {
    "name": "Shoulder Circles",
    "dbId": "Shoulder_Circles",
    "muscles": "Shoulders, upper back",
    "equipment": "None",
    "setup": null,
    "steps": [
      "Arms relaxed at your sides.",
      "Roll your shoulders up, back and down in a big circle, 10 times.",
      "Then 10 times forward."
    ],
    "mistakes": null,
    "swap": null
  },
  "hip_circles": {
    "name": "Standing Hip Circles",
    "dbId": "Standing_Hip_Circles",
    "muscles": "Hips",
    "equipment": "None",
    "setup": null,
    "steps": [
      "Hands on your hips, feet shoulder-width apart.",
      "Draw big circles with your hips, 10 in each direction."
    ],
    "mistakes": null,
    "swap": null
  },
  "glute_bridge": {
    "name": "Glute Bridge",
    "dbId": "Butt_Lift_Bridge",
    "muscles": "Glutes, hamstrings",
    "equipment": "Mat (body weight)",
    "setup": null,
    "steps": [
      "Lie on your back, knees bent, feet flat near your butt.",
      "Push through your heels and lift your hips until your body is a straight line from shoulders to knees.",
      "Squeeze your glutes for 1 second and lower slowly. 12 reps."
    ],
    "mistakes": null,
    "swap": null
  },
  "incline_walk": {
    "name": "Incline Treadmill Walk",
    "dbId": "Walking_Treadmill",
    "muscles": "Heart and fat burning, plus glutes and calves",
    "equipment": "Treadmill",
    "setup": "Warm up for 1 minute at 0% incline and 4 km/h, then raise the incline.",
    "steps": [
      "Set the incline to 8-12% and the speed to 4.5-5.5 km/h.",
      "Walk tall and swing your arms; don't hold the handrails.",
      "Go at a pace where you can talk in short sentences but can't sing (Zone 2).",
      "Week 1: start with 15 min if 20 feels too hard, then build up."
    ],
    "mistakes": [
      "Holding the handrails (it makes it much easier and hurts your posture)",
      "Setting the incline so high that you have to lean back"
    ],
    "swap": "Stairmaster at a slow pace, or elliptical."
  },
  "bike": {
    "name": "Bike (moderate)",
    "dbId": "Recumbent_Bike",
    "muscles": "Heart and fat burning, easy on tired legs",
    "equipment": "Recumbent or upright bike",
    "setup": "Adjust the seat so your knee is slightly bent at the furthest pedal point.",
    "steps": [
      "Pedal at a steady, moderate effort (about 6 out of 10) for 20 minutes.",
      "Keep 70-90 RPM (pedal turns per minute) if the screen shows it.",
      "You should be able to talk in short sentences."
    ],
    "mistakes": [
      "Level so high that you can only pedal slowly and grind"
    ],
    "swap": "Elliptical."
  },
  "shoulder_stretch": {
    "name": "Shoulder Dislocates (towel)",
    "dbId": "Round_The_World_Shoulder_Stretch",
    "muscles": "Shoulders, chest",
    "equipment": "Towel, band or light stick",
    "setup": null,
    "steps": [
      "Hold a towel or band with a wide grip in front of you.",
      "With straight arms, slowly bring it over your head and behind you as far as feels comfortable.",
      "Bring it back to the front. Repeat slowly 8-10 times."
    ],
    "mistakes": [
      "Forcing the range; widen your grip instead"
    ],
    "swap": null
  },
  "cat_stretch": {
    "name": "Cat-Cow Back Stretch",
    "dbId": "Cat_Stretch",
    "muscles": "Back",
    "equipment": "Mat",
    "setup": null,
    "steps": [
      "Start on your hands and knees.",
      "Round your back up toward the ceiling and tuck your chin; hold 3 seconds.",
      "Let your belly drop and look up slightly; hold 3 seconds.",
      "Repeat slowly 8 times."
    ],
    "mistakes": null,
    "swap": null
  },
  "hip_flexor": {
    "name": "Hip Flexor Stretch",
    "dbId": "Standing_Hip_Flexors",
    "muscles": "Front of the hips",
    "equipment": "None",
    "setup": null,
    "steps": [
      "Step one foot forward into a split stance, back knee soft.",
      "Tuck your hips under (squeeze the back glute) and shift forward until you feel a stretch at the front of the back hip.",
      "Hold 30 seconds on each side."
    ],
    "mistakes": null,
    "swap": null
  },
  "hamstring_stretch": {
    "name": "Seated Hamstring Stretch",
    "dbId": "Seated_Hamstring_and_Calf_Stretch",
    "muscles": "Hamstrings, calves",
    "equipment": "Mat",
    "setup": null,
    "steps": [
      "Sit with your legs straight out in front of you.",
      "Keep your back flat and reach toward your toes until you feel a stretch behind your thighs.",
      "Hold 30 seconds. Don't bounce."
    ],
    "mistakes": null,
    "swap": null
  },
  "calf_stretch": {
    "name": "Wall Calf Stretch",
    "dbId": "Calf_Stretch_Hands_Against_Wall",
    "muscles": "Calves",
    "equipment": "Wall",
    "setup": null,
    "steps": [
      "Hands on a wall, one foot back with the heel on the floor and that leg straight.",
      "Lean forward until you feel the stretch in the calf.",
      "Hold 30 seconds on each leg."
    ],
    "mistakes": null,
    "swap": null
  }
};

export const SESSIONS = [
  {
    "id": "push",
    "tab": "Push",
    "day": "Monday",
    "focus": "Chest · Shoulders · Triceps",
    "color": "#E8590C",
    "light": "#FFF1E6",
    "warmupKeys": [
      "warm_bike",
      "arm_circles",
      "shoulder_circles"
    ],
    "warmupText": "5' easy bike\n10 arm + 10 shoulder circles\n1 light set Chest Press",
    "lifts": [
      {
        "key": "chest_press",
        "sets": 3,
        "reps": "8-12",
        "top": 12,
        "rest": "2 min",
        "restSec": 120
      },
      {
        "key": "incline_press",
        "sets": 3,
        "reps": "8-12",
        "top": 12,
        "rest": "90s",
        "restSec": 90
      },
      {
        "key": "shoulder_press",
        "sets": 3,
        "reps": "8-12",
        "top": 12,
        "rest": "90s",
        "restSec": 90
      },
      {
        "key": "pec_deck",
        "sets": 3,
        "reps": "10-15",
        "top": 15,
        "rest": "60s",
        "restSec": 60
      },
      {
        "key": "lateral_raise",
        "sets": 3,
        "reps": "12-15",
        "top": 15,
        "rest": "60s",
        "restSec": 60
      },
      {
        "key": "rope_pushdown",
        "sets": 3,
        "reps": "10-15",
        "top": 15,
        "rest": "60s",
        "restSec": 60
      },
      {
        "key": "plank",
        "sets": 3,
        "reps": "30-45s",
        "top": 45,
        "rest": "45s",
        "track": "reps",
        "note": "kg blank · reps = seconds",
        "restSec": 45
      }
    ],
    "cardio": {
      "key": "incline_walk",
      "minutes": 20,
      "setting": "8-12% · 4.5-5.5 km/h",
      "unit": "incline %"
    },
    "cooldownKeys": [
      "shoulder_stretch",
      "cat_stretch",
      "hip_flexor"
    ]
  },
  {
    "id": "pull",
    "tab": "Pull",
    "day": "Wednesday",
    "focus": "Back · Rear shoulders · Biceps",
    "color": "#1971C2",
    "light": "#E7F1FB",
    "warmupKeys": [
      "warm_bike",
      "arm_circles",
      "shoulder_circles"
    ],
    "warmupText": "5' easy bike\n10 arm + 10 shoulder circles\n1 light set Lat Pulldown",
    "lifts": [
      {
        "key": "lat_pulldown",
        "sets": 3,
        "reps": "8-12",
        "top": 12,
        "rest": "2 min",
        "restSec": 120
      },
      {
        "key": "cable_row",
        "sets": 3,
        "reps": "8-12",
        "top": 12,
        "rest": "90s",
        "restSec": 90
      },
      {
        "key": "db_row",
        "sets": 3,
        "reps": "10-12",
        "top": 12,
        "rest": "60s",
        "note": "per arm",
        "restSec": 60
      },
      {
        "key": "reverse_pec_deck",
        "sets": 3,
        "reps": "12-15",
        "top": 15,
        "rest": "60s",
        "restSec": 60
      },
      {
        "key": "preacher_curl",
        "sets": 3,
        "reps": "10-12",
        "top": 12,
        "rest": "60s",
        "restSec": 60
      },
      {
        "key": "hammer_curl",
        "sets": 3,
        "reps": "10-12",
        "top": 12,
        "rest": "60s",
        "restSec": 60
      },
      {
        "key": "ab_crunch",
        "sets": 3,
        "reps": "12-15",
        "top": 15,
        "rest": "60s",
        "restSec": 60
      }
    ],
    "cardio": {
      "key": "incline_walk",
      "minutes": 20,
      "setting": "8-12% · 4.5-5.5 km/h",
      "unit": "incline %"
    },
    "cooldownKeys": [
      "shoulder_stretch",
      "cat_stretch",
      "hamstring_stretch"
    ]
  },
  {
    "id": "legs",
    "tab": "Legs",
    "day": "Friday",
    "focus": "Quads · Hamstrings · Glutes · Calves",
    "color": "#2F9E44",
    "light": "#EBF7EE",
    "warmupKeys": [
      "warm_bike",
      "hip_circles",
      "glute_bridge"
    ],
    "warmupText": "5' easy bike\n10 hip circles + 12 bridges\n+ 10 bodyweight squats\n1 light set Leg Press",
    "lifts": [
      {
        "key": "leg_press",
        "sets": 3,
        "reps": "10-12",
        "top": 12,
        "rest": "2 min",
        "restSec": 120
      },
      {
        "key": "goblet_squat",
        "sets": 3,
        "reps": "10-12",
        "top": 12,
        "rest": "90s",
        "restSec": 90
      },
      {
        "key": "leg_curl",
        "sets": 3,
        "reps": "10-12",
        "top": 12,
        "rest": "90s",
        "restSec": 90
      },
      {
        "key": "leg_extension",
        "sets": 3,
        "reps": "12-15",
        "top": 15,
        "rest": "60s",
        "restSec": 60
      },
      {
        "key": "db_rdl",
        "sets": 3,
        "reps": "10-12",
        "top": 12,
        "rest": "90s",
        "restSec": 90
      },
      {
        "key": "hip_abductor",
        "sets": 3,
        "reps": "15",
        "top": 15,
        "rest": "60s",
        "restSec": 60
      },
      {
        "key": "seated_calf",
        "sets": 3,
        "reps": "12-15",
        "top": 15,
        "rest": "60s",
        "restSec": 60
      }
    ],
    "cardio": {
      "key": "bike",
      "minutes": 20,
      "setting": "moderate · 70-90 RPM",
      "unit": "level"
    },
    "cooldownKeys": [
      "hip_flexor",
      "hamstring_stretch",
      "calf_stretch"
    ]
  }
];

export const MAIN_LIFTS = [
  "chest_press",
  "shoulder_press",
  "lat_pulldown",
  "leg_press"
];

export const START_HERE = [
  {
    "heading": "Your week",
    "paragraphs": [
      "MONDAY · PUSH: chest, shoulders, triceps",
      "WEDNESDAY · PULL: back, rear shoulders, biceps",
      "FRIDAY · LEGS: quads, hamstrings, glutes, calves",
      "Can't do Mon/Wed/Fri? Any 3 days with a rest day between them works. Keep the order Push → Pull → Legs."
    ]
  },
  {
    "heading": "Every session (~85 min)",
    "paragraphs": [
      "① WARM-UP · 8 min: easy bike, mobility, then 1 light set of the first exercise.",
      "② LIFTING · ~50 min: 7 exercises × 3 sets, done in the order listed.",
      "③ CARDIO · 20 min: incline walk (Push & Pull) or bike (Legs).",
      "④ COOL-DOWN · 5 min: 3 stretches, 30 seconds each."
    ]
  },
  {
    "heading": "How to use the app",
    "paragraphs": [
      "1. On Home, tap today's day. The one that's next is marked \"Next up\".",
      "2. Tap Start workout. The app walks you through warm-up → 7 exercises → cardio → cool-down.",
      "3. On each exercise, check the photos, type the kg and reps, then tap ✓. The rest timer starts by itself.",
      "4. The kg from last time is filled in for you, and last time's reps are shown in grey.",
      "5. Tap Next → when all sets are done, and Finish workout at the end.",
      "6. Once a week, log your bodyweight in Progress (morning, before breakfast).",
      "Plank: leave kg empty and type the seconds in reps. One-arm row: log ONE dumbbell and reps for ONE arm."
    ]
  },
  {
    "heading": "How heavy? Reps in reserve",
    "paragraphs": [
      "\"Reps in reserve\" = how many more reps you could have done with good form.",
      "Weeks 1-2: stop with ~3 reps left. Focus on learning the movements and the machine settings.",
      "Week 3 onwards: stop with 1-2 reps left. The last reps should be slow and hard, but clean.",
      "Never keep going once your form breaks down."
    ]
  },
  {
    "heading": "When to add weight (double progression)",
    "paragraphs": [
      "Each exercise has a rep range, e.g. 3 × 8-12. Start with a weight you can lift about 8-10 times.",
      "Every week, try to add 1-2 reps at the same weight.",
      "When ALL sets reach the top of the range, the app shows \"+ Add weight\" on that exercise next time.",
      "How much to add: machines/cables +2.5-5 kg (one pin), dumbbells +1-2 kg.",
      "Your reps will drop back to ~8. That's normal; climb back up again.",
      "A ⭐ next to a set means you beat last time. 💪"
    ]
  },
  {
    "heading": "Rest between sets",
    "paragraphs": [
      "First exercise: 2 min. Others: 60-90 s. The rest time is written under each exercise name.",
      "Use the timer on your phone."
    ]
  },
  {
    "heading": "Cardio",
    "paragraphs": [
      "Incline walk: 8-12% incline, 4.5-5.5 km/h, no holding the handrails.",
      "Bike on Legs day: moderate effort. Your legs are already tired, so the bike is kinder than the treadmill.",
      "Effort: you can talk in short sentences but can't sing. Start at 15 min in week 1 if 20 is too much."
    ]
  },
  {
    "heading": "Machine taken?",
    "paragraphs": [
      "Every exercise in the Guide tab has a \"Machine taken?\" swap. Or do the next exercise and come back."
    ]
  },
  {
    "heading": "Safety & recovery",
    "paragraphs": [
      "Adjust the seat on every machine before your first set. Ask the gym staff if unsure.",
      "Lower the weight under control (2-3 seconds). Never drop it.",
      "Breathe out when you push or pull, breathe in on the way back.",
      "Sharp or joint pain (not muscle burn) = stop that exercise and use the swap.",
      "Sleep 7-9 h, eat protein with every meal (~1.6 g per kg of bodyweight per day), drink water."
    ]
  },
  {
    "heading": "Backups",
    "paragraphs": [
      "Your workouts are saved on this phone only. Export a backup in Settings every 2 weeks (the app reminds you) and keep the file in Google Drive or iCloud."
    ]
  }
];
