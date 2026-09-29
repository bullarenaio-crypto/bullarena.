// Load Secure House/Escrow Wallet from Environment Variable (Supports Base58 or Number Array)
let houseKeypair = null;
try {
  const secretKeyEnv = process.env.HOUSE_WALLET_PRIVATE_KEY;
  if (secretKeyEnv) {
    let secretKeyBytes;
    // Verifica se está em formato de array (ex: [12,34,56...]) ou string Base58
    if (secretKeyEnv.trim().startsWith('[')) {
      secretKeyBytes = Uint8Array.from(JSON.parse(secretKeyEnv));
    } else {
      secretKeyBytes = bs58.decode(secretKeyEnv.trim());
    }
    houseKeypair = Keypair.fromSecretKey(secretKeyBytes);
    console.log(`🔐 Secure House Wallet Loaded: ${houseKeypair.publicKey.toBase58()}`);
  } else {
    houseKeypair = Keypair.generate();
    console.log(`⚠️ Warning: Using generated temporary wallet: ${houseKeypair.publicKey.toBase58()}`);
  }
} catch (err) {
  console.error('Error loading House Wallet keypair:', err);
  houseKeypair = Keypair.generate();
}
