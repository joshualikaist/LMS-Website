export type Note = {
  date: string;
  title: string;
  kind: "RESEARCH NOTE" | "LEARNING NOTE" | "ENGINEERING NOTE";
  minutes: number;
  status: "draft" | "published";
  slug?: string;
  body?: string[];
};

export const notes: Note[] = [
  {
    date: "2026.09",
    title: "Failure modes in sensor-only UAV navigation",
    kind: "RESEARCH NOTE",
    minutes: 7,
    status: "published",
    slug: "sensor-only-failure-modes",
    body: [
      "MOTAR is a sensor-only intercept: the drone has to keep a moving target in play while flying through clutter, with no external tracker and no prebuilt map. The interesting part is not the average success rate. It is the ways the policy fails when the observation is incomplete.",
      "The first failure is occlusion. Every obstacle dodge hides the target. If the policy treats “I cannot see it” as “it is gone,” it either freezes or chases the last pixel. A useful policy has to keep a short-horizon guess of where the target still is, then reacquire without turning that guess into a hallucinated goal.",
      "The second failure is lag. The intercept point is not where the target is. If the observation is delayed, or the target turns while the drone is committed to a gap, the intercept heading is already wrong. Sensor-only makes this worse because you cannot cheat with a motion-capture state.",
      "The third failure is the flight envelope. A learned command that looks good in the observation can still be something the airframe cannot do. That is why MOTAR splits see / decide / fly: the policy proposes, the controller refuses what the aircraft cannot survive.",
      "These three — lost sight, late intercept, illegal command — are the failure modes I am actually debugging in simulation. The rest of the writeup lives on the MOTAR case study and technical notes.",
    ],
  },
  {
    date: "2026.08",
    title: "Understanding PPO through UAV navigation",
    kind: "LEARNING NOTE",
    minutes: 11,
    status: "published",
    slug: "ppo-through-uav-navigation",
    body: [
      "PPO is easier to remember if you stop thinking about Atari and start thinking about a drone that has to not hit a wall. The policy outputs a maneuver. The environment answers with a new camera/LiDAR view, a reward, and sometimes a crash.",
      "The clip in PPO is the part that matters for flight. A huge policy update can look like progress on paper and still throw the aircraft into a region it has never recovered from. Clipping says: do not jump too far from the behavior that was already collecting data. For a UAV, that is less a math trick and more a survival constraint.",
      "Advantage estimation is the other piece. “Did this dodge help?” is not obvious when the target is still moving and the collision happens two seconds later. The value function is doing the bookkeeping the onboard sensors cannot: was this heading actually closer to a future intercept that does not clip a pole?",
      "I am not claiming MOTAR’s current training recipe is finished. The note is just the mapping I use when I read a PPO paper next to a flight log: policy step ≈ command, clip ≈ stay flyable, value ≈ did this actually help later.",
    ],
  },
  {
    date: "2026.08",
    title: "Isaac Gym, Isaac Sim, and what actually changes",
    kind: "ENGINEERING NOTE",
    minutes: 9,
    status: "published",
    slug: "isaac-gym-and-isaac-sim",
    body: [
      "People collapse Isaac Gym and Isaac Sim into “the NVIDIA simulator.” They are not the same layer. Gym is the throughput engine: thousands of parallel environments, GPU physics, the loop you need if you are going to burn PPO samples. Sim is the scene: cameras, lighting, the world the policy will eventually have to look at.",
      "What actually changes when you move between them is the observation, not the algorithm name. A vectorized contact reward in Gym does not automatically become a usable onboard image in Sim. The policy can overfit to a privileged state that a real drone will never have.",
      "The engineering question for MOTAR is therefore not “which Isaac.” It is which facts are allowed to leave the simulator and enter the policy. Camera and LiDAR in; ground-truth target pose out, except as a training-only critic if we decide that is honest. Everything else is a leak.",
      "Until the observation contract is written down, switching renderers just changes the way the same cheat can hide. That contract is what the technical notes are for.",
    ],
  },
];

export function getNote(slug: string) {
  return notes.find((note) => note.slug === slug && note.status === "published") ?? null;
}

export function publishedNotes() {
  return notes.filter((note) => note.status === "published");
}
