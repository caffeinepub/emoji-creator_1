import Array "mo:core/Array";
import Random "mo:core/Random";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  type EmojiConfig = {
    name : Text;
    baseShape : Text;
    eyeStyle : Text;
    mouthStyle : Text;
    accessory : Text;
    expression : Text;
    color : Text;
  };

  module EmojiConfig {
    public func compare(config1 : EmojiConfig, config2 : EmojiConfig) : Order.Order {
      config1.name.compare(config2.name);
    };
  };

  let emojiMap = Map.empty<Nat, EmojiConfig>();
  var nextId = 0;

  func addEmojiConfig(config : EmojiConfig) : Nat {
    emojiMap.add(nextId, config);
    let currentId = nextId;
    nextId += 1;
    currentId;
  };

  func getEmojiConfigInternal(id : Nat) : EmojiConfig {
    switch (emojiMap.get(id)) {
      case (null) { Runtime.trap("Emoji configuration not found") };
      case (?config) { config };
    };
  };

  public query ({ caller }) func getAllEmojiConfigs() : async [EmojiConfig] {
    emojiMap.values().toArray().sort();
  };

  public shared ({ caller }) func saveEmoji(config : EmojiConfig) : async Nat {
    addEmojiConfig(config);
  };

  public shared ({ caller }) func deleteEmoji(id : Nat) : async () {
    if (not emojiMap.containsKey(id)) {
      Runtime.trap("Emoji with id " # id.toText() # " not found");
    };
    emojiMap.remove(id);
  };

  public query ({ caller }) func getEmoji(id : Nat) : async EmojiConfig {
    getEmojiConfigInternal(id);
  };

  public shared ({ caller }) func seedSampleEmojis() : async () {
    if (emojiMap.size() > 0) { Runtime.trap("Already seeded") };

    let sample1 : EmojiConfig = {
      name = "Smiley";
      baseShape = "Circle";
      eyeStyle = "Round";
      mouthStyle = "Big Smile";
      accessory = "None";
      expression = "Happy";
      color = "Yellow";
    };

    let sample2 : EmojiConfig = {
      name = "Cool Guy";
      baseShape = "Square";
      eyeStyle = "Sunglasses";
      mouthStyle = "Smirk";
      accessory = "Sunglasses";
      expression = "Cool";
      color = "Blue";
    };

    let sample3 : EmojiConfig = {
      name = "Surprised";
      baseShape = "Oval";
      eyeStyle = "Wide";
      mouthStyle = "Open Mouth";
      accessory = "None";
      expression = "Surprised";
      color = "Pink";
    };

    ignore addEmojiConfig(sample1);
    ignore addEmojiConfig(sample2);
    ignore addEmojiConfig(sample3);
  };
};
