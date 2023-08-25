import * as Form from "@radix-ui/react-form";
import "flatpickr/dist/themes/airbnb.css";
import { InputField } from "../../components/InputField/InputField";
import { SelectField } from "../../components/SelectField/SelectField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { adultFormFamilyAndAddressInfoSchema } from "../../schemas/adultForm/familyAddressInfo.schema";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import AdultFormBackground, { AdultFormSteps } from "./components/AdultFormBackground";
import Notify from "../../components/Notify/Notify";
import { DEVICES_ARRAY, INCOME_LEVELS_ARRAY } from "../../utils/consts.utils";
import { saveFamilyAndAddresInfo } from "../../api/adultForm.api";

const FamilyAddressInfo = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(adultFormFamilyAndAddressInfoSchema) });

    const navigate = useNavigate();
    const { sampleId, participantId } = useParams();

    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    const onSubmit = handleSubmit(async (data) => {
        if (!sampleId) {
            setNotificationTitle("Amostra inválida!");
            setNotificationDescription(
                "Por favor, verifique se você realmente está utilizando o link fornecido pelo pesquisador."
            );
            return;
        }
        if (!participantId) {
            setNotificationTitle("Participante inválido!");
            setNotificationDescription("Por favor, recarregue a página e tente novamente.");
            return;
        }

        try {
            const response = await saveFamilyAndAddresInfo(sampleId, participantId, data);
            if (response.status === 200) {
                navigate(`../${participantId}/read-accept-docs`);
            }
        } catch (erroLogin) {
            console.error(erroLogin);
            setNotificationTitle("Erro no servidor.");
            setNotificationDescription("Por favor, tente novamente mais tarde.");
        }
    });
    return (
        <Notify
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
        >
            <AdultFormBackground currentStep={AdultFormSteps.FAMILY_INFO}>
                <div className="grid gap-y-10">
                    <header>
                        <h1>Informações familiares e de moradia</h1>
                        <h3>Preencha os campos abaixo para continuar.</h3>
                    </header>
                    <Form.Root onSubmit={onSubmit} className="w-full">
                        <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 md:grid-cols-3 ">
                            <InputField
                                {...register("familyData.qttChildrens")}
                                label="Número de filhos*"
                                type="number"
                                placeholder="Quantos filhos você tem?"
                                errorMessage={errors.familyData?.qttChildrens?.message}
                            />
                            <InputField
                                {...register("familyData.qttSiblings")}
                                label="Número de irmãos/irmãs*"
                                placeholder="Quantos irmãos ou irmãs você tem?"
                                type="number"
                                errorMessage={errors.familyData?.qttSiblings?.message}
                            />
                            <SelectField
                                {...register("familyData.qttFamilyMembers")}
                                label="Quantas pessoas moram com você?*"
                                placeholder="Selecione uma opção"
                                errorMessage={errors.familyData?.qttFamilyMembers?.message}
                            >
                                {[...Array(8).keys()].map((i) => (
                                    <option>{i}</option>
                                ))}
                                <option>+ de 8</option>
                            </SelectField>
                            <SelectField
                                {...register("familyData.familyMonthIncome")}
                                label="Renda familiar total mensal*"
                                placeholder="selecione uma opção"
                                errorMessage={errors.familyData?.familyMonthIncome?.message}
                            >
                                {INCOME_LEVELS_ARRAY.map((income) => (
                                    <option>{income}</option>
                                ))}
                            </SelectField>

                            <Form.Field name="personalData.houseDevices" className="mb-6 w-full px-3">
                                <Form.Label className="mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                                    Aparelhos na casa
                                </Form.Label>
                                <Form.Control asChild>
                                    <select
                                        {...register("familyData.houseDevices")}
                                        multiple
                                        className="h-fit w-full rounded-[4px] px-4 text-sm"
                                    >
                                        {DEVICES_ARRAY.map((device) => (
                                            <option>{device}</option>
                                        ))}
                                    </select>
                                </Form.Control>
                            </Form.Field>
                            <Form.Field name="personalData.outsideHouseDevices" className="mb-6 w-full px-3">
                                <Form.Label className="mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                                    Fora de casa, você tem acesso a
                                </Form.Label>
                                <Form.Control asChild>
                                    <select
                                        {...register("familyData.outsideHouseDevices")}
                                        multiple
                                        className="h-fit w-full rounded-[4px] px-4 text-sm"
                                    >
                                        {DEVICES_ARRAY.map((device) => (
                                            <option>{device}</option>
                                        ))}
                                    </select>
                                </Form.Control>
                            </Form.Field>
                            <InputField
                                {...register("addressData.city")}
                                label="Cidade*"
                                placeholder="Informe o nome da sua cidade"
                                errorMessage={errors.addressData?.city?.message}
                            />
                            <InputField
                                {...register("addressData.district")}
                                label="Bairro*"
                                placeholder="Informe o nome do seu bairro"
                                errorMessage={errors.addressData?.district?.message}
                            />
                            <InputField
                                {...register("addressData.street")}
                                label="Rua*"
                                placeholder="Informe o nome da sua rua"
                                errorMessage={errors.addressData?.street?.message}
                            />
                            <InputField
                                {...register("addressData.houseNumber")}
                                label="Número da casa*"
                                placeholder="informe o número da casa"
                                errorMessage={errors.addressData?.houseNumber?.message}
                            />
                        </div>
                        <Form.Submit asChild>
                            <button className="button-secondary">Continuar</button>
                        </Form.Submit>
                    </Form.Root>
                </div>
            </AdultFormBackground>
        </Notify>
    );
};

export default FamilyAddressInfo;
