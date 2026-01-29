"use client";

import { LoginForm } from "./LoginForm";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import Image from "next/image";
import logo from "@/assets/google.png";
import localFont from "next/font/local";

const Nunito = localFont({ src: "../../assets/fonts/NunitoSans-VariableFont.ttf" });

export default function FormHandler() {
    const title = "Login to your Account";
    const subtitle = "Impossible is what we do best!";

    return (
        <div className="w-full">
            <div className={`${Nunito.className} w-full flex flex-col items-center justify-center h-full`}>
                <div className="w-3/4 2xl:w-1/2">
                    {/* Header */}
                    <div className="py-2 pb-2 self-start">
                        <div className="text-[#525252] text-4xl font-bold">{title}</div>
                        <div className="text-[#525252] text-base font-medium pt-1">{subtitle}</div>
                    </div>

                    {/* Google CTA */}
                    <div className="py-2 self-start">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="w-full py-5 border-gray-200 hover:bg-[#F4F4F5] dark:text-[#828282] bg-white rounded-lg font-semibold text-[#828282] text-sm"
                                        variant="outline"
                                    // onClick={() => {/* TODO: wire up Google auth */}}
                                    >
                                        <Image src={logo} alt="" className="w-4 mr-[10px]" />
                                        Continue with Google
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Under Development</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Divider */}
                    <div className="py-4 px-8">
                        <Separator className="bg-[#F2F2F3]" />
                    </div>

                    {/* Auth form area */}
                    <div className="space-y-6">
                        <LoginForm />
                    </div>

                    {/* Footer switch */}
                    <div className="flex flex-row pt-12 justify-center text-sm">
                        <div className="pr-[6px] text-[#828282] font-[400]">Not Registered Yet?</div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        className="text-red-700 font-bold hover:cursor-pointer"
                                    >
                                        Create an Account
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Under Development</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}
