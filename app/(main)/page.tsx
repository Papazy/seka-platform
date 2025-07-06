'use client'
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/enum";
import { useEffect } from "react";

export default function Home(){
  const {user, isLoading} = useAuth();
  const router = useRouter();
  
  useEffect(()=> {
    if (!isLoading) {
      if(!user){
        router.push('/login');
      }else{
        switch(user.role) {
          case UserRole.ADMIN:
            router.push('/admin');
            break;
          case UserRole.DOSEN:
            router.push('/dosen');
            break;
          case UserRole.LABORAN:
            router.push('/laboran');
            break;
          case UserRole.MAHASISWA:
            router.push('/mahasiswa');
            break;
          default:
            console.log("unknown role", user.role);
            router.push('/login');
        }
      }
    }
  },[isLoading, user, router]);
    

  return <LoadingSpinner />;

}