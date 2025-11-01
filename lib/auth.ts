import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { UserRole } from "./enum";

export interface TokenPayload {
  id: string;
  email: string;
  nama: string;
  role: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function signToken(
  payload: Omit<TokenPayload, "iat" | "exp">,
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    // console.log("Verifying token:", token);
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function hashPassword(password: string) {
  const bcrypt = (await import("bcrypt")).default;
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  const bcrypt = (await import("bcrypt")).default;
  return bcrypt.compare(password, hash);
}

export async function loginWithCredentials(
  credential: string,
  password: string,
) {
  // cek admin
  const admin = await prisma.admin.findUnique({ where: { email: credential } });
  if (admin && (await comparePassword(password, admin.password))) {
    const token = await signToken({
      id: admin.id,
      email: admin.email,
      nama: admin.nama,
      role: UserRole.ADMIN,
    });
    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        nama: admin.nama,
        role: UserRole.ADMIN,
      },
    };
  }

  // cek laboran
  const laboran = await prisma.laboran.findUnique({
    where: { email: credential },
  });
  if (laboran && (await comparePassword(password, laboran.password))) {
    const token = await signToken({
      id: laboran.id,
      email: laboran.email,
      nama: laboran.nama,
      role: UserRole.LABORAN,
    });
    return {
      token,
      user: {
        id: laboran.id,
        email: laboran.email,
        nama: laboran.nama,
        role: UserRole.LABORAN,
      },
    };
  }

  // cek dosen
  const dosen = await prisma.dosen.findFirst({
    where: { OR: [{ email: credential }, { nip: credential }] },
  });
  if (dosen && (await comparePassword(password, dosen.password))) {
    const token = await signToken({
      id: dosen.id,
      email: dosen.email,
      nama: dosen.nama,
      role: UserRole.DOSEN,
    });
    return {
      token,
      user: {
        id: dosen.id,
        email: dosen.email,
        nama: dosen.nama,
        role: UserRole.DOSEN,
      },
    };
  }

  // cek mahasiswa
  const mahasiswa = await prisma.mahasiswa.findFirst({
    where: { OR: [{ email: credential }, { npm: credential }] },
  });
  if (mahasiswa && (await comparePassword(password, mahasiswa.password))) {
    const token = await signToken({
      id: mahasiswa.id,
      email: mahasiswa.email,
      nama: mahasiswa.nama,
      role: UserRole.MAHASISWA,
    });
    return {
      token,
      user: {
        id: mahasiswa.id,
        email: mahasiswa.email,
        nama: mahasiswa.nama,
        role: UserRole.MAHASISWA,
      },
    };
  }

  return null;
}
